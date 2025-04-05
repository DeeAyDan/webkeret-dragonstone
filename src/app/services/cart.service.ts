
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

  addToCart(userID: string, product: Product, quantity: number = 1): void {
    let cart = this.getCart(userID);
    let productID = product.id;
    if (!cart) return;

    let item = cart.items.find(i => i.productID === product.id);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productID, quantity });
    }

    cart.total = this.calculateTotal(cart);
  }

  removeFromCart(userID: string, productID: string): void {
    let cart = this.getCart(userID);
    if (!cart) return;

    cart.items = cart.items.filter(item => item.productID !== productID);
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
    return cart.items.reduce((sum, item) => {
      const price = this.productService.getPriceById(item.productID);
      return sum + (price ?? 0) * item.quantity;
    }, 0);
  }
}
