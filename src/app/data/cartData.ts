import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { User } from "../models/user";

export const CartData: Cart[] = [
    {
        userID: '1',
        items: [
            {
                productID: '101',
                quantity: 2
            },
            {
                productID: '102',
                quantity: 1
            }
        ]
    },
    {
        userID: '2',
        items: [
            {
                productID: '103',
                quantity: 1
            }
        ]
    },
    {
        userID: '3',
        items: []
    }
];