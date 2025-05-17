import { Cart } from "./cart";

export interface User {
    id: string; // It's the uid in firebase
    name: string;
    email: string;
    address?: string;
    phone?: string;
};