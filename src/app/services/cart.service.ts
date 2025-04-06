
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import { CartData } from '../data/cartData';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carts: Cart[] = CartData;
  private productService: ProductService = new ProductService();
  constructor(private userService: UserService) {
  }

  getProductById(id: string): Product | undefined {
    return this.productService.getProductById(id);
  }

  getCart(userID: string): Cart | undefined {
    return this.carts.find(cart => cart.userID === userID);
  }

  addToCart(product: Product,userID: string = 'guest'): void {
    let cart = this.getCart(userID);
    let productID = product.id;
    if (!cart) return;

    let item = cart.items.find(i => i.productID === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productID, quantity: 1 });
    }

    cart.total = this.calculateTotal(cart);
  }

  removeFromCart(product: Product, userID: string = 'guest'): void {
    let cart = this.getCart(userID);
    if (!cart) return;

    cart.items = cart.items.filter(item => item.productID !== product.id);
    cart.total = this.calculateTotal(cart);
  }

  decreaseQuantity(product: Product, userID: string = 'guest'): void {
    let cart = this.getCart(userID);
    if (!cart) return;

    let item = cart.items.find(i => i.productID === product.id);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.removeFromCart(product);
      }
    }

    cart.total = this.calculateTotal(cart);
  }

  clearCart(userID: string): void {
    let cart = this.getCart(userID);
    if (cart) {
      cart.items = [];
      cart.total = 0;
    }
  }

  calculateTotal(cart: Cart): number {
    return parseFloat(cart.items.reduce((sum, item) => {
      const product = this.productService.getProductById(item.productID);
      if (!product) return sum;

      const price = product.onSale ? product.discountedPrice : product.price;
      return sum + (price ?? 0) * item.quantity;
    }, 0).toFixed(2));
  }
}
