import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Observable, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  selectedProduct?: Product;
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    this.loading = true;
    this.productService.getProducts().pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    ).subscribe({
      next: (products) => {
        // Initialize products with 0 rating first
        this.products = products.map(product => ({
          ...product,
          averageRating: 0,
          ratingCount: 0
        }));
        
        // Then fetch ratings for each product individually
        products.forEach((product, index) => {
          this.productService.getProductAverageRating(product.id).pipe(
            catchError(() => of(0))
          ).subscribe(rating => {
            this.products[index] = {
              ...this.products[index],
              averageRating: rating || 0
            };
          });
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error in loadProducts:', error);
        this.products = [];
        this.loading = false;
      }
    });
  }

  showProductDetails(product: Product) {
    this.selectedProduct = product;
  }
}
