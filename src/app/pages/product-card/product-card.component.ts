import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormatPricePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();
  
  averageRating: number = 0;

  constructor(
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.reviewService.getAverageRatingForProduct(this.product.id).subscribe(rating => {
      this.averageRating = rating;
    });
  }

  onClick() {
    this.router.navigate(['/product', this.product.id]);
  }
}
