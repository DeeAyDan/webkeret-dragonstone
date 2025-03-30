import { Cart } from "./cart";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
}