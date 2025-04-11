import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';
import { MatCardModule } from '@angular/material/card';
import { Review } from '../../models/review';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormatPricePipe, MatCardModule, FormsModule, MatFormField, MatInputModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  newReview: Review = {
    rating: 5,
    comment: '',
    userID: 'Guest',
    productID: '',
    date: new Date()
  };

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product = this.productService.getProductById(productId);
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
      alert('Product added to cart!');
      this.router.navigate(['/cart']);
    } else {
      alert('Product not found!');
    }
  }

  submitReview() {
    if (this.product && !this.product.reviews) this.product.reviews = [];
    if (this.product?.reviews) {
      this.product.reviews.push({ ...this.newReview });
    }
    this.newReview = { rating: 5, comment: '', userID: '', productID: '', date: new Date() };
  }

  goBack() {
    this.router.navigate(['/shop']);
  }
}
