import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'dragonstone';
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      localStorage.setItem('isLoggedIn', this.isLoggedIn? 'true' : 'false');
    })
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
