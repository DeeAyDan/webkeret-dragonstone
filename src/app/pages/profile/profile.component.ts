import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  loading = false;
  private userSubscription?: Subscription;
  currentUser?: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      address: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    this.loading = true;
    this.userSubscription = this.authService.currentUser.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.userService.getUserById(firebaseUser.uid);
        if (userData) {
          this.currentUser = userData;
          this.profileForm.patchValue({
            name: userData.name || '',
            email: userData.email || '',
            address: userData.address || '',
            phone: userData.phone || ''
          });
        }
      } else {
        // Not logged in, redirect to login
        this.router.navigate(['/login']);
      }
      this.loading = false;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async onSubmit() {
    if (this.profileForm.invalid || !this.currentUser) {
      return;
    }

    this.loading = true;
    try {
      const formData = this.profileForm.getRawValue();
      await this.userService.updateUser(this.currentUser.id, {
        name: formData.name,
        address: formData.address,
        phone: formData.phone
      });

      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      this.snackBar.open('Error updating profile. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } finally {
      this.loading = false;
    }
  }
}
