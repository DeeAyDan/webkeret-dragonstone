import { Review } from "./review";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categories: string[];
    images: string[];
    rating: number;
    reviews: Review[];
    discount?: number;
}
