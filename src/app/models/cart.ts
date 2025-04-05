import { Product } from "./product";
import { User } from "./user";

export interface Cart {
    userID: User['id'];
    items: {productID: Product['id'], quantity: number}[];
    total?: number;
}
