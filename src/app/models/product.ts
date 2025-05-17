export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categories: string[];
    images: string[];
    onSale?: boolean;
    discount?: number;
    reviews?: any;
    averageRating?: number;
  }