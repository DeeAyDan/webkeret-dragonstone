import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  selectedProduct?: Product;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.products = this.productService.getProducts();
  }

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.products.forEach((product) => {
      product.averageRating = this.productService.getProductAverageRating(
        product.id
      );
    });
  }

  showProductDetails(product: Product) {
    this.selectedProduct = product;
  }
}
