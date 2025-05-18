import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = collection(this.firestore, 'Users');
      const querySnapshot = await getDocs(usersRef);
      
      const users: User[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>)
      }));
      
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }
  

  // Get user by ID as a Promise
  async getUserById(id: string): Promise<User | undefined> {
    try {
      const userRef = doc(collection(this.firestore, 'Users'), id);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as User;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserNameOrEmailById(id: string): Promise<string | undefined> {
    try {
      const userRef = doc(collection(this.firestore, 'Users'), id);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const user = userSnap.data() as User;
        return user.name && user.name.trim() !== '' ? user.name : user.email;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching user name or email:', error);
      return undefined;
    }
  }

  // Update user profile
  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'Users', userId);
      await updateDoc(userRef, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}