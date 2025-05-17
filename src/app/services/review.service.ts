import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  getDocs,
  DocumentData
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Review } from '../models/review';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  getReviews(): Observable<Review[]> {
    const reviewsRef = collection(this.firestore, 'reviews');
    const q = query(reviewsRef, orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map(reviews => this.convertDates(reviews as DocumentData[]))
    );
  }

  getReviewsByProduct(productID: string): Observable<Review[]> {
    const reviewsRef = collection(this.firestore, 'reviews');
    const q = query(
      reviewsRef, 
      where('productID', '==', productID),
      orderBy('date', 'desc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(reviews => this.convertDates(reviews as DocumentData[]))
    );
  }

  async addReview(review: Omit<Review, 'date'>): Promise<string> {
    const reviewsRef = collection(this.firestore, 'reviews');
    const reviewWithDate = { 
      ...review,
      date: serverTimestamp()
    };
    
    const docRef = await addDoc(reviewsRef, reviewWithDate);
    return docRef.id;
  }

  getAverageRatingForProduct(productId: string): Observable<number> {
    return this.getReviewsByProduct(productId).pipe(
      map(reviews => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return parseFloat((sum / reviews.length).toFixed(2));
      })
    );
  }

  private convertDates(reviews: DocumentData[]): Review[] {
    return reviews.map(review => {
      const data = review as any;
      return {
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date
      } as Review;
    });
  }
}
