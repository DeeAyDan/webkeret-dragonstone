import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  getDoc, 
  query, 
  where
} from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private firestore: Firestore,
    private reviewService: ReviewService
  ) {}

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'Products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Get a product by ID
   */
  getProductById(productId: string): Observable<Product | undefined> {
    const productRef = doc(this.firestore, 'Products', productId);
    return from(getDoc(productRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() } as Product;
        } else {
          return undefined;
        }
      })
    );
  }

  /**
   * Get a product and its reviews
   */
  getProductWithReviews(productId: string): Observable<Product | undefined> {
    return this.getProductById(productId).pipe(
      switchMap(product => {
        if (!product) {
          return of(undefined);
        }
        
        return this.reviewService.getReviewsByProduct(productId).pipe(
          map(reviews => {
            return {
              ...product,
              reviews: reviews
            };
          })
        );
      })
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    // Firestore array-contains query for categories array
    const q = query(
      productsRef,
      where('categories', 'array-contains', category)
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Get product average rating
   */
  getProductAverageRating(productId: string): Observable<number | undefined> {
    return this.reviewService.getReviewsByProduct(productId).pipe(
      map(reviews => {
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          return Math.round((totalRating / reviews.length) * 10) / 10;
        }
        return undefined;
      })
    );
  }

  /**
   * Calculate discounted price
   */
  getDiscountedPrice(price: number, discount: number): number {
    return Math.round(price * (1 - discount) * 100) / 100;
  }
}
