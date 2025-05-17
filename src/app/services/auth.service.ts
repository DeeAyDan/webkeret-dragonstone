import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { collection, Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: Observable<FirebaseUser | null>;
 
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.currentUser = authState(this.auth);
  }
 
  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.updateLoginStatus(true);
        return userCredential;
      });
  }
 
  signOut(): Promise<void> {
    this.updateLoginStatus(false);
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }
 
  async signUp(
    email: string,
    password: string,
    userData: Partial<User>
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
     
      // Ensure we have all required fields based on your Firestore structure
      await this.createUserData(userCredential.user.uid, {
        id: userCredential.user.uid,
        email: email,
        name: userData.name || '',
        address: userData.address || '',
        phone: userData.phone || '',
        ...userData // Include any other fields from userData
      });
     
      return userCredential;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  }
 
  private async createUserData(
    userID: string,
    userData: Partial<User>
  ): Promise<void> {
    try {
      // Use lowercase 'users' to match your Firestore collection name
      const userRef = doc(collection(this.firestore, 'users'), userID);
      return setDoc(userRef, userData);
    } catch (error) {
      console.error('Error creating user data:', error);
      throw error;
    }
  }
 
  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }
 
  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }
}