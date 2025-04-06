import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ReviewService } from './review.service';
import { reviewData } from '../data/reviewData';
import { ProductData } from '../data/productData';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = ProductData;
  private reviews: Review[] = reviewData;

  constructor() {
    // Initialize products with reviews
    this.products = this.products.map(product => {
      if (product.onSale){
        product.discountedPrice = this.getDiscountedPrice(product.price, product.discount!);
      }
      const productReviews = this.reviews.filter(review => review.productID === product.id);
      return { ...product, reviews: productReviews };
    });
  } 

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getPriceById(id: string): number | undefined {
    const product = this.getProductById(id);
    return product?.price;
  }
  
  getProductAverageRating(id: string): number | undefined {
    const product = this.getProductById(id);
    if (product && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      return Math.round((totalRating / product.reviews.length) * 10) / 10;
     }
    return undefined;
  }

  getDiscountedPrice(price: number, discount: number): number {
      return Math.round(price * (1 - discount) * 100) / 100;
    }
  }
