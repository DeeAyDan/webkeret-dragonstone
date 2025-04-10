import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { User } from "../models/user";

export const CartData: Cart[] = [
    {
        userID: 'guest',
        items: [
            {
                productID: '103',
                quantity: 1
            }
        ]
    },
    {
        userID: 'deeaydan',
        items: []
    },
    {
        userID: 'lobatomyanthony',
        items: []
    },
    {
        userID: 'bobsmith',
        items: []
    }
];