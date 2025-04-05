
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
    this.cart = this.cartService.getCart('1');
    this.displayItems = this.cart?.items.map(item => {
      const product = this.cartService.getProductById(item.productID);
      return {
        product: product!,
        quantity: item.quantity
      };
    }) || [];
  }
  
  getTotalPrice(): number {
    return this.displayItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }
  

  
}
