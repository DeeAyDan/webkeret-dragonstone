import { Review } from "./review";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    inStock: boolean;
    categories: string[];
    images: string[];
    rating: number;
    reviews: Review[];
    discount?: number;
}
