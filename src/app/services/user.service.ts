import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { userData } from '../data/userData';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = userData;

  constructor() {}

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
