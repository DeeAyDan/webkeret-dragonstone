export interface Review {
    userID: string;
    productID: string;
    rating: number;
    comment?: string;
    date: Date;
}
