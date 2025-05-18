import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductRatingComponent } from '../product-rating/product-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductRatingComponent],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isCompact: boolean = false;
  @Input() truncateTitle: boolean = true;
  @Input() showStock: boolean = true;
  @Input() lowStockThreshold: number = 5;
  @Input() backgroundColor: string = '#f8f9fa';

  @Output() addToCart = new EventEmitter<Product>();
  @Output() imageLoadError = new EventEmitter<string>();

  constructor(private router: Router) {}

  getCurrentPrice(): number {
    if (this.product.onSale && this.product.discount) {
      return this.getDiscountedPrice(this.product.price, this.product.discount);
    }
    return this.product.price;
  }

  getDiscountedPrice(price: number, discount: number = 0): number {
    return Math.round(price * (1 - discount) * 100) / 100;
  }

  getStockStatus(): string {
    if (!this.product.stock) {
      return 'Out of Stock';
    }
    if (this.product.stock <= this.lowStockThreshold) {
      return `Low Stock (${this.product.stock} left)`;
    }
    return 'In Stock';
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/product', this.product.id]);
  }

  onImageError(): void {
    this.imageLoadError.emit(this.product.images[0]);
  }
}
