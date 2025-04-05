import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ReviewService } from './review.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [];

  constructor(private reviewService: ReviewService) {
    this.products = [
      {
        id: '101',
        name: 'Gothic Shield Ring',
        description: 'A stylish ring made of stainless steel.',
        price: 49.99,
        stock: 10,
        categories: ['Jewelry', 'Gothic'],
        images: ['images/ring1.jpg'],
        rating: 4.5,
        reviews: this.reviewService.getReviewsByProduct('101'),
        discount: 10
      },
      {
        id: '102',
        name: 'Black skull Necklace',
        description: 'A classic black skull necklace with chocker and silver pendant.',
        price: 29.99,
        stock: 15,
        categories: ['Jewelry', 'Gothic'],
        images: ['images/necklace1.jpg'],
        rating: 4.2,
        reviews: this.reviewService.getReviewsByProduct('102')
      }
    ];
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }
}
