
import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carts: Cart[] = [];

  constructor(private userService: UserService) {
    // Initialize carts for all users
    this.userService.getUsers().forEach(user => {
      this.carts.push({ userID: user.id, items: [] });
    });
  }

  getCart(userID: number): Cart | undefined {
    return this.carts.find(cart => cart.userID === userID);
  }

  addToCart(userID: number, product: Product, quantity: number = 1): void {
    let cart = this.getCart(userID);
    if (!cart) return;

    let item = cart.items.find(i => i.product.id === product.id);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    cart.total = this.calculateTotal(cart);
  }

  removeFromCart(userID: number, productID: string): void {
    let cart = this.getCart(userID);
    if (!cart) return;

    cart.items = cart.items.filter(item => item.product.id !== productID);
    cart.total = this.calculateTotal(cart);
  }

  clearCart(userID: number): void {
    let cart = this.getCart(userID);
    if (cart) {
      cart.items = [];
      cart.total = 0;
    }
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
