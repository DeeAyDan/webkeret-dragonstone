import { Injectable } from '@angular/core';
import { Review } from '../models/review';
import { reviewData } from '../data/reviewData';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviews: Review[] = reviewData;

  constructor() {}

  getReviews(): Review[] {
    return this.reviews;
  }

  getReviewsByProduct(productID: string): Review[] {
    return this.reviews.filter(review => review.productID === productID);
  }

  getReviewsByUser(userID: string): Review[] {
    return this.reviews.filter(review => review.userID === userID);
  }
}
