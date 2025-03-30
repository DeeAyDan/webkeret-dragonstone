
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart: Cart | undefined;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Replace '1' with dynamic user ID when authentication is implemented
  }

  getTotalPrice(): number {
    return this.cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  }
}
