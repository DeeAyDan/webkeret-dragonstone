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
  updateDoc
} from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject, firstValueFrom } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<Cart | undefined>(undefined);
  public cart$ = this.cartItems.asObservable();
  private cartsCollection;

  constructor(
    private userService: UserService,
    private firestore: Firestore,
    private authService: AuthService,
    private productService: ProductService
  ) {
    this.cartsCollection = collection(this.firestore, 'Carts');
    
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
        // Return a default cart structure instead of undefined
        return of({
          userID: userID || 'guest',
          items: [],
          total: 0
        });
      })
    );
  }

  // Get cart as a Promise
  async getCart(userID: string): Promise<Cart | undefined> {
    try {
      const cart = await this.getCartFromFirebase(userID);
      // If cart is undefined, return a default cart structure
      if (!cart) {
        return {
          userID: userID || 'guest',
          items: [],
          total: 0
        };
      }
      return cart;
    } catch (error) {
      console.error('Error in getCart:', error);
      // Return a default cart structure in case of error
      return {
        userID: userID || 'guest',
        items: [],
        total: 0
      };
    }
  }

  private async getCartFromFirebase(userID: string): Promise<Cart | undefined> {
    try {
      // Access the cart document directly using the userID
      const cartRef = doc(this.cartsCollection, userID);
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        const cartData = cartSnap.data() as Cart;
        // Ensure items array exists
        if (!cartData.items) {
          cartData.items = [];
        }
        return cartData;
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
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      const userID = user ? user.uid : 'guest';
      
      const cart = await this.getCart(userID);
      if (!cart) return;

      // Make sure product has an ID
      if (!product.id) {
        console.error('Product ID is missing');
        return;
      }

      let productID = product.id;
      let item = cart.items.find(i => i.productID === productID);
      
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productID, quantity: 1 });
      }
      
      // Update cart total
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
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
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
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
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
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      const userID = user ? user.uid : 'guest';
      
      const cartRef = doc(this.cartsCollection, userID);
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
    try {
      // Ensure cart is valid
      if (!cart) {
        console.error('Cannot update cart total: cart is undefined');
        return;
      }
      
      // Ensure items array exists
      if (!cart.items) {
        cart.items = [];
      }
      
      // Calculate cart total with proper discount handling
      let total = 0;

      // Process each cart item one by one
      for (const item of cart.items) {
        try {
          // Check if item is valid
          if (!item) {
            console.error('Invalid cart item encountered');
            continue;
          }
          
          // Check if productID exists
          if (!item.productID) {
            console.error('ProductID is missing for item:', item);
            continue;
          }
          
          // Check if quantity is valid
          if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
            console.error('Invalid quantity for item:', item);
            item.quantity = 1; // Set a default quantity
          }
                    
          const product = await firstValueFrom(
            this.productService.getProductById(item.productID).pipe(
              take(1),
              catchError(error => {
                console.error(`Error fetching product ${item.productID}:`, error);
                return of(null);
              })
            )
          );
          
          if (product) {
            let price = typeof product.price === 'number' ? product.price : 0;
            // Apply discount if available
            if (product.discount && product.discount > 0) {
              price = this.productService.getDiscountedPrice(price, product.discount);
            }
            total += price * item.quantity;
          }
        } catch (error) {
          console.error(`Error processing product ${item?.productID}:`, error);
        }
      }
      
      // Round to 2 decimal places
      cart.total = Math.round(total * 100) / 100;
      
      // Update cart in Firebase
      try {
        const cartRef = doc(this.cartsCollection, userID);
        await updateDoc(cartRef, { 
          items: cart.items,
          total: cart.total 
        });
      } catch (firebaseError) {
        console.error('Error updating cart in Firebase:', firebaseError);
      }
    } catch (error) {
      console.error('Error updating cart total:', error);
    }
  }

  // Get current user's cart
  getCurrentUserCart(): Observable<Cart | undefined> {
    return this.cart$;
  }
  
  // Get cart item count for badge display
  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((count, item) => count + item.quantity, 0);
      })
    );
  }
}