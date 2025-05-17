import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, MatMenuModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  currentPage = 'home';
  isLoggedIn = false;
  private authSubscription?: Subscription;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.isLoggedIn().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  pageSwitch(page: string) {
    this.currentPage = page;
  }
  
  logout() {
    this.authService.signOut()
      .then(() => {
        this.router.navigate(['/home']);
        this.pageSwitch('home');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }
}