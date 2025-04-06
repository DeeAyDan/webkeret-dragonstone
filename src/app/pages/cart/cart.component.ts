
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: Cart | undefined;

  displayItems: {
    product: Product,
    quantity: number
  }[] = [];

  constructor(private cartService: CartService) {
    
  }

  ngOnInit() {
    this.loadCart();
  }
  
  increaseQuantity(product: Product) {
    this.cartService.addToCart(product);
    this.loadCart();
    console.log(this.cartService.getCart('guest'));
  }
  
  decreaseQuantity(product: Product) {
    this.cartService.decreaseQuantity(product);
    this.loadCart();
  }
  
  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
    this.loadCart();
  }

  loadCart() {
    this.cart = this.cartService.getCart('guest');
    this.displayItems = this.cart?.items.map(item => {
      const product = this.cartService.getProductById(item.productID);
      return {
        product: product!,
        quantity: item.quantity
      };
    }) || [];
  }

  checkout() {
    alert('Checkout functionality is not implemented yet.');
  }

  totalPrice() {
  return    this.cartService.calculateTotal(this.cart!);
  }
}
