import { Product } from "./product";
import { User } from "./user";

export interface Cart {
    userID: User['id'];
    items: {product: Product, quantity: number}[];
    total?: number;
}
