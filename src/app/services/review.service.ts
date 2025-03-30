import { Injectable } from '@angular/core';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviews: Review[] = [
    {
      userID: '1',
      productID: '101',
      rating: 5,
      comment: 'Amazing quality! The best gothic ring I have ever bought.',
      date: new Date('2024-03-01')
    },
    {
      userID: '2',
      productID: '102',
      rating: 4,
      comment: 'Looks great, but the size runs a bit small.',
      date: new Date('2024-03-15')
    },
    {
      userID: '3',
      productID: '101',
      rating: 3,
      comment: 'Nice design but expected better material.',
      date: new Date('2024-03-20')
    }
  ];

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
