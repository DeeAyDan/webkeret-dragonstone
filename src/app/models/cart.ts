import { Product } from "./product";

export interface Cart {
    userID: string;
    items: {productID: Product['id'], quantity: number}[];
    total: number;
}
