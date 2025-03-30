import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[] = [
    { id: 1, name: "Daniel", email: "admin", password: "admin"},
  ];

  constructor() { }

  getUsers(): User[] {
    return this.users;
  }
}
