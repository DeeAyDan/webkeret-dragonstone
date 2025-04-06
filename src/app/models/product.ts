import { Review } from "./review";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categories: string[];
    images: string[];
    reviews: Review[];
    averageRating?: number;
    onSale?: boolean;
    discount?: number;
    discountedPrice?: number;
}
