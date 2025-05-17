import { Component, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  selectedProduct?: Product;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
  
      // Fetch and attach average ratings for each product
      this.products.forEach(product => {
        this.productService.getProductAverageRating(product.id).subscribe(rating => {
          product.averageRating = rating;
        });
      });
    });
  }
  

  showProductDetails(product: Product) {
    this.selectedProduct = product;
  }
}
