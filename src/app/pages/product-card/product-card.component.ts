import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, FormatPricePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(['/product', this.product.id]);
  }
}
