import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from '@angular/fire/firestore';
import { Observable, from, of, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Cart | undefined>(undefined);
  public cart$ = this.cartItems.asObservable();

  constructor(
    private userService: UserService,
    private firestore: Firestore,
    private authService: AuthService,
    private productService: ProductService
  ) {
    // Initialize cart based on authentication status
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.getCartObservable(user.uid).subscribe(cart => {
          this.cartItems.next(cart);
        });
      } else {
        this.getCartObservable('guest').subscribe(cart => {
          this.cartItems.next(cart);
        });
      }
    });
  }

  // Get cart as an Observable
  getCartObservable(userID: string): Observable<Cart | undefined> {
    return from(this.getCartFromFirebase(userID)).pipe(
      catchError(error => {
        console.error('Error getting cart:', error);
        return of(undefined);
      })
    );
  }

  // Get cart as a Promise
  async getCart(userID: string): Promise<Cart | undefined> {
    return this.getCartFromFirebase(userID);
  }

  private async getCartFromFirebase(userID: string): Promise<Cart | undefined> {
    try {
      const cartRef = doc(collection(this.firestore, 'Carts'), userID);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        return cartSnap.data() as Cart;
      } else {
        // Create a new cart if it doesn't exist
        const newCart: Cart = {
          userID,
          items: [],
          total: 0
        };
        await setDoc(cartRef, newCart);
        return newCart;
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      return undefined;
    }
  }

  async addToCart(product: Product): Promise<void> {
    try {
      // Get current user ID
      const user = await this.authService.currentUser.pipe(take(1)).toPromise();
      const userID = user ? user.uid : 'guest';
      
      const cart = await this.getCart(userID);
      if (!cart) return;

      // Make sure product has an ID
      if (!product.id) {
        console.error('Product ID is missing');
        return;
      }

      let productID = product.id;
      let item = cart.items.find(i => i.productID === product.id);
      
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productID, quantity: 1 });
      }
      
      // Use the product service to calculate total with discounts
      await this.updateCartTotal(cart, userID);
      
      // Update cart in BehaviorSubject
      this.cartItems.next(cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async removeFromCart(productId: string): Promise<void> {
    try {
      // Get current user ID
      const user = await this.authService.currentUser.pipe(take(1)).toPromise();
      const userID = user ? user.uid : 'guest';
      
      const cart = await this.getCart(userID);
      if (!cart) return;
      
      cart.items = cart.items.filter(item => item.productID !== productId);
      
      // Update cart total and save to Firebase
      await this.updateCartTotal(cart, userID);
      
      // Update cart in BehaviorSubject
      this.cartItems.next(cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  async decreaseQuantity(productId: string): Promise<void> {
    try {
      // Get current user ID
      const user = await this.authService.currentUser.pipe(take(1)).toPromise();
      const userID = user ? user.uid : 'guest';
      
      const cart = await this.getCart(userID);
      if (!cart) return;
      
      let item = cart.items.find(i => i.productID === productId);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          await this.removeFromCart(productId);
          return;
        }
      }
      
      // Update cart total and save to Firebase
      await this.updateCartTotal(cart, userID);
      
      // Update cart in BehaviorSubject
      this.cartItems.next(cart);
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  }

  async clearCart(): Promise<void> {
    try {
      // Get current user ID
      const user = await this.authService.currentUser.pipe(take(1)).toPromise();
      const userID = user ? user.uid : 'guest';
      
      const cartRef = doc(collection(this.firestore, 'Carts'), userID);
      const emptyCart: Cart = {
        userID,
        items: [],
        total: 0
      };
      
      await updateDoc(cartRef, { items: [], total: 0 });
      
      // Update cart in BehaviorSubject
      this.cartItems.next(emptyCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  private async updateCartTotal(cart: Cart, userID: string): Promise<void> {
    // Create an array of promises to get product prices
    const pricePromises = cart.items.map(item => 
      this.productService.getProductById(item.productID).pipe(take(1)).toPromise()
    );
    
    // Resolve all promises to get products
    const products = await Promise.all(pricePromises);
    
    // Calculate cart total with proper discount handling
    let total = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      const product = products[i];
      
      if (product) {
        let price = product.price;
        // Apply discount if available
        if (product.discount && product.discount > 0) {
          price = this.productService.getDiscountedPrice(price, product.discount);
        }
        total += price * item.quantity;
      }
    }
    
    // Round to 2 decimal places
    cart.total = Math.round(total * 100) / 100;
    
    // Update cart in Firebase
    const cartRef = doc(collection(this.firestore, 'Carts'), userID);
    await updateDoc(cartRef, { items: cart.items, total: cart.total });
  }

  // Get current user's cart
  getCurrentUserCart(): Observable<Cart | undefined> {
    return this.cart$;
  }
  
  // Get cart item count for badge display
  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => {
        if (!cart) return 0;
        return cart.items.reduce((count, item) => count + item.quantity, 0);
      })
    );
  }
}