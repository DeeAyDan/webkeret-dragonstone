export interface Review {
    id?: string;
    userID: string;
    productID: string;
    rating: number;
    comment?: string;
    date: Date;
    reviewerName?: string;
}
