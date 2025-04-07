
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormatPricePipe],
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

    if (this.cart) {
    this.cart.total = this.cartService.calculateTotal(this.cart);
  }
  }

  checkout() {
    alert('Checkout functionality is not implemented yet.');
  }

  totalPrice() {
  return    this.cartService.calculateTotal(this.cart!);
  }
}
