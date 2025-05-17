import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Cart } from '../../models/cart';
import { Product } from '../../models/product';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';
import { ConfirmRemoveDialogComponent } from '../confirm-remove-dialog/confirm-remove-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { Subscription, forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormatPricePipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | undefined;
  displayedColumns: string[] = [
    'image',
    'name',
    'quantity',
    'price',
    'subtotal',
  ];
  displayItems: {
    product: Product | undefined;
    quantity: number;
  }[] = [];
 
  loading = true;
  userId: string = 'guest';
  private subscriptions: Subscription = new Subscription();
 
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}
 
  ngOnInit() {
    // Subscribe to the cart$ observable from the CartService
    this.subscriptions.add(
      this.authService.currentUser.subscribe(user => {
        this.userId = user ? user.uid : 'guest';
        this.loadCart();
      })
    );
  }
 
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
 
  async increaseQuantity(product: Product) {
    this.loading = true;
    await this.cartService.addToCart(product);
  }
 
  async decreaseQuantity(productId: string) {
    this.loading = true;
    await this.cartService.decreaseQuantity(productId);
  }
 
  removeFromCart(productId: string) {
    const dialogRef = this.dialog.open(ConfirmRemoveDialogComponent);
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loading = true;
        await this.cartService.removeFromCart(productId);
      }
    });
  }
 
  loadCart() {
    this.loading = true;
    
    this.subscriptions.add(
      this.cartService.getCartObservable(this.userId).pipe(
        switchMap(cart => {
          this.cart = cart;
          
          if (!cart || cart.items.length === 0) {
            this.displayItems = [];
            return of(null);
          }
          
          // Get all products for cart items
          const productObservables = cart.items.map(item => 
            this.productService.getProductById(item.productID)
          );
          
          return forkJoin(productObservables).pipe(
            map(products => {
              this.displayItems = cart.items.map((item, index) => {
                return {
                  product: products[index],
                  quantity: item.quantity,
                };
              });
              return cart;
            })
          );
        })
      ).subscribe(
        () => {
          this.loading = false;
        },
        error => {
          console.error('Error loading cart:', error);
          this.loading = false;
        }
      )
    );
  }
 
  async checkout() {
    alert('Checkout functionality is not implemented yet.');
  }
 
  totalPrice(): number {
    return this.cart ? this.cart.total : 0;
  }
  
  // Helper method to calculate subtotal for a cart item
  getSubtotal(product: Product | undefined, quantity: number): number {
    if (!product) return 0;
    
    let price = product.price;
    if (product.discount && product.discount > 0) {
      price = this.productService.getDiscountedPrice(price, product.discount);
    }
    
    return price * quantity;
  }
}