import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatGridListModule, MatCardModule, MatButtonModule, NgStyle, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  randomProducts: Product[] = [];
  index = 1;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.randomProducts = this.getRandomProducts();
    console.log(this.randomProducts);
  }

  getRandomProducts(): Product[] {
    const allProducts = [...this.productService.getProducts()];
    const selected: Product[] = [];
  
    while (selected.length < 3 && allProducts.length > 0) {
      const index = Math.floor(Math.random() * allProducts.length);
      selected.push(allProducts.splice(index, 1)[0]);
    }
  
    return selected;
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToProductDetail(product: Product) {
    this.router.navigate([`/product/${product.id}`]);
  }
}
