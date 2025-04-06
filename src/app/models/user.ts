import { Cart } from "./cart";

export interface User {
    id: string; // It's the username
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
}