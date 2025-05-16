import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
    NgStyle
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  authSubscription?: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  onSubmit() {
    this.login();
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      
      // Using signIn method which returns a Promise
      this.authService.signIn(email, password)
        .then((userCredential) => {
          this.isLoading = false;
          this.authService.updateLoginStatus(true);
          this.router.navigate(['/home']); // Navigate to your dashboard or home page
        })
        .catch((error) => {
          this.isLoading = false;
          this.loginError = this.getErrorMessage(error.code);
        });
    } else {
      this.loginForm.markAllAsTouched(); // Show validation errors
    }
  }
  
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/user-not-found':
        return 'No account exists with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials. Please check your email and password.';
      default:
        return `Authentication error: ${errorCode || 'Unknown error occurred. Please try again.'}`;
    }
  }
}
