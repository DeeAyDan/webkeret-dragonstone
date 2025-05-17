import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { FormatPricePipe } from '../../shared/pipes/format-price.pipe';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {
  NgIf,
  NgFor,
  AsyncPipe,
  DatePipe,
  CommonModule,
} from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Subscription, take, Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';
import { UserService } from '../../services/user.service';
import { TimePipe } from '../../shared/pipes/time.pipe';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    FormatPricePipe,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    NgIf,
    AsyncPipe,
    CommonModule,
    TimePipe
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product$: Observable<Product | undefined> | undefined;
  productId: string | null = null;
  nameOfReviewer: string | null = null;
  reviews: Review[] = [];
  currentUser: FirebaseUser | null = null;
  authSubscription: Subscription | undefined;
  reviewsSubscription: Subscription | undefined;

  newReview: Omit<Review, 'date'> = {
    rating: 5,
    comment: '',
    userID: '',
    productID: '',
  };

  isSubmitting = false;
  reviewSubmitted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');

    // Subscribe to auth state
    this.authSubscription = this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
      if (user && this.productId) {
        this.newReview.userID = user.uid;
        this.newReview.productID = this.productId;
      }
    });

    if (this.productId) {
      this.product$ = this.productService.getProductWithReviews(this.productId);

      this.reviewsSubscription = this.reviewService
        .getReviewsByProduct(this.productId)
        .subscribe(async (reviews) => {
          const reviewsWithNames = await Promise.all(
            reviews.map(async (review) => {
              const nameOrEmail = await this.userService.getUserNameOrEmailById(
                review.userID
              );
              return {
                ...review,
                reviewerName: nameOrEmail ?? 'Unknown User',
              };
            })
          );
          this.reviews = reviewsWithNames;
        });
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.reviewsSubscription) {
      this.reviewsSubscription.unsubscribe();
    }
  }

  addToCart(product: Product) {
    if (product) {
      this.cartService.addToCart(product);
      alert('Product added to cart!');
    }
  }

  async submitReview() {
    if (!this.currentUser) {
      alert('Please log in to submit a review');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.productId) {
      alert('Product ID is missing');
      return;
    }

    // Validate review
    if (!this.newReview.comment || this.newReview.comment.trim() === '') {
      alert('Please enter a comment');
      return;
    }

    this.isSubmitting = true;

    try {
      await this.reviewService.addReview({
        ...this.newReview,
        productID: this.productId,
        userID: this.currentUser.uid,
      });

      // Reset form
      this.newReview = {
        rating: 5,
        comment: '',
        userID: this.currentUser.uid,
        productID: this.productId,
      };

      this.reviewSubmitted = true;
      setTimeout(() => {
        this.reviewSubmitted = false;
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/shop']);
  }

  getUserHasReviewed(): boolean {
    if (!this.currentUser) return false;
    return this.reviews.some(
      (review) => review.userID === this.currentUser?.uid
    );
  }

  /**
   * Get discounted price
   */
  getDiscountedPrice(product: Product): number {
    if (product.discount && product.discount > 0) {
      return this.productService.getDiscountedPrice(
        product.price,
        product.discount
      );
    }
    return product.price;
  }

  /**
   * Check if product has discount
   */
  hasDiscount(product: Product): boolean {
    return product.discount !== undefined && product.discount > 0;
  }

  /**
   * Get discount percentage for display
   */
  getDiscountPercentage(product: Product): string {
    if (product.discount) {
      return `${Math.round(product.discount * 100)}%`;
    }
    return '0%';
  }
}
