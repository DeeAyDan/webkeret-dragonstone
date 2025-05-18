import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle } from '@angular/common';
import { map, Observable, Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  randomProducts: Product[] = [];
  isLoggedIn: boolean = false;
  welcomeMessage: string = 'Welcome to Dragonstone';
  userAuthSubscription?: Subscription;
  currentUser: User | null = null;
  
  constructor(
    private productService: ProductService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getRandomProducts().subscribe(products => {
      this.randomProducts = products;
    });
      
    // Auth subscription
    this.userAuthSubscription = this.authService.isLoggedIn().subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.updateWelcomeMessage();
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.userAuthSubscription) {
      this.userAuthSubscription.unsubscribe();
    }
  }
  
  updateWelcomeMessage() {
    if (this.isLoggedIn && this.currentUser?.email) {
      this.welcomeMessage = `Welcome back to Dragonstone, ${this.currentUser.email}!`;
    } else {
      this.welcomeMessage = 'Welcome to Dragonstone';
    }
  }
  
  getRandomProducts(): Observable<Product[]> {
    return this.productService.getProducts().pipe(
      map(products => {
        const allProducts = [...products];
        const selected: Product[] = [];
        while (selected.length < 3 && allProducts.length > 0) {
          const index = Math.floor(Math.random() * allProducts.length);
          selected.push(allProducts.splice(index, 1)[0]);
        }
        return selected;
      })
    );
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