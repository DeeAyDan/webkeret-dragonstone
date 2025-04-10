import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';
import { ConfirmRemoveDialogComponent } from '../confirm-remove-dialog/confirm-remove-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FormatPricePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cart: Cart | undefined;
  displayedColumns: string[] = [
    'image',
    'name',
    'quantity',
    'price',
    'subtotal',
  ];

  displayItems: {
    product: Product;
    quantity: number;
  }[] = [];

  constructor(private cartService: CartService, private dialog: MatDialog) {}

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
    const dialogRef = this.dialog.open(ConfirmRemoveDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.removeFromCart(product);
        this.loadCart();
      }
    });
  }

  loadCart() {
    this.cart = this.cartService.getCart('guest');
    this.displayItems =
      this.cart?.items.map((item) => {
        const product = this.cartService.getProductById(item.productID);
        return {
          product: product!,
          quantity: item.quantity,
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
    return this.cartService.calculateTotal(this.cart!);
  }
}
