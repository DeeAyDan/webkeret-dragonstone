import { Review } from "../models/review";

export const reviewData: Review[] = [
   {
      userID: 'deeaydan',
      productID: '101',
      rating: 5,
      comment: 'Amazing quality! The best gothic ring I have ever bought.',
      date: new Date('2024-03-01')
    },
    {
      userID: 'lobatomyanthony',
      productID: '101',
      rating: 5,
      comment: 'Looks great, but the size runs a bit small.',
      date: new Date('2024-03-15')
    },
    {
      userID: 'bobsmith',
      productID: '101',
      rating: 4,
      comment: 'Nice design but expected better material.',
      date: new Date('2024-03-20')
    } 
];