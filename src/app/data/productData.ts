import { Product } from "../models/product";

export const ProductData: Product[] = [
    {
        id: '101',
        name: 'Gothic Shield Ring',
        description: 'A stylish ring made of stainless steel.',
        price: 49.99,
        stock: 10,
        categories: ['Jewelry', 'Gothic'],
        images: ['images/ring1.jpg'],
        reviews: [],
        discount: 10
      },
      {
        id: '102',
        name: 'Black skull Necklace',
        description: 'A classic black skull necklace with chocker and silver pendant.',
        price: 29.99,
        stock: 15,
        categories: ['Jewelry', 'Gothic'],
        images: ['images/necklace1.jpg'],
        reviews: []
      }   
]