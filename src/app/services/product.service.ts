import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  getDoc, 
  query, 
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter
} from '@angular/fire/firestore';
import { Observable, from, map, of } from 'rxjs';
import { Product } from '../models/product';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection;

  constructor(
    private firestore: Firestore,
    private reviewService: ReviewService
  ) {
    this.productsCollection = collection(this.firestore, 'Products');
  }

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
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
      map(product => {
        if (!product) {
          return undefined;
        }
        return product;
      })
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const q = query(
      this.productsCollection,
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

  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id'>): Promise<string> {
    const docRef = await addDoc(this.productsCollection, product);
    return docRef.id;
  }

  /**
   * Update a product
   */
  async updateProduct(productId: string, product: Partial<Product>): Promise<void> {
    const productRef = doc(this.firestore, 'Products', productId);
    await updateDoc(productRef, product);
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<void> {
    const productRef = doc(this.firestore, 'Products', productId);
    await deleteDoc(productRef);
  }

  /**
   * Get featured products (complex query 1)
   * Gets top rated products with discount
   */
  getFeaturedProducts(limitCount: number = 5): Observable<Product[]> {
    const q = query(
      this.productsCollection,
      where('discount', '>', 0),
      orderBy('discount', 'desc'),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Get products by price range (complex query 2)
   */
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    const q = query(
      this.productsCollection,
      where('price', '>=', minPrice),
      where('price', '<=', maxPrice),
      orderBy('price', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Get paginated products (complex query 3)
   */
  getPaginatedProducts(pageSize: number = 10, lastVisible?: any): Observable<Product[]> {
    let q;
    if (lastVisible) {
      q = query(
        this.productsCollection,
        orderBy('name'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      q = query(
        this.productsCollection,
        orderBy('name'),
        limit(pageSize)
      );
    }
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Search products (complex query 4)
   * Search by name and filter by category and price range
   */
  searchProducts(
    searchTerm: string,
    category?: string,
    minPrice?: number,
    maxPrice?: number
  ): Observable<Product[]> {
    let constraints: any[] = [
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    ];

    if (category) {
      constraints.push(where('categories', 'array-contains', category));
    }
    if (minPrice !== undefined) {
      constraints.push(where('price', '>=', minPrice));
    }
    if (maxPrice !== undefined) {
      constraints.push(where('price', '<=', maxPrice));
    }

    const q = query(this.productsCollection, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }
}
