import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name: [''],
      address: [''],
      phoneNumber: [''],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    try {
      const formData = this.registerForm.value;
      
      // Prepare user data according to your User model
      const userData: Partial<User> = {
        name: formData.name,
        address: formData.address || '',
        phone: formData.phoneNumber || '', // Map phoneNumber to phone field
        // We're not setting id, email, or cart here because AuthService.signUp handles that
      };
      
      await this.authService.signUp(
        formData.email,
        formData.password,
        userData
      );
      
      this.authService.updateLoginStatus(true);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    } finally {
      this.loading = false;
    }
  }
}