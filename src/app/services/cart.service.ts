import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { UserService } from './user.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  carts: Cart[] = [];

  constructor(private userService: UserService) {
    this.initializeCarts();
  }

  private initializeCarts(): void {
    const users = this.userService.getUsers();
    this.carts = users.map(user => ({
      userID: user.id,
      items: []
    }));
  }

  getCartByUserId(userId: number): Cart | undefined {
    return this.carts.find(cart => cart.userID === userId);
  }

  addToCart(userId: number, product: Product, quantity: number = 1): void {
    let cart = this.carts.find(c => c.userID === userId);
    if (!cart) {
      cart = { userID: userId, items: [] };
      this.carts.push(cart);
    }
  
    const existingItem = cart.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }
  }
  
}
