import { Cart } from "./cart";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
}