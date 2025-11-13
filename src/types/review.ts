export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  helpfulCount: number;
  verifiedStay: boolean;
  markedHelpfulBy: string[]; // Array of user IDs who marked this helpful
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type ReviewSortOption = 'recent' | 'helpful' | 'highest' | 'lowest';

export type ReviewFilterRating = 'all' | '5' | '4' | '3' | '2' | '1';

export interface ReviewFormData {
  rating: number;
  comment: string;
}
