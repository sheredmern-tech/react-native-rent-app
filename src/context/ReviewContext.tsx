import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review, ReviewStats, ReviewSortOption, ReviewFilterRating } from '../types';

interface ReviewContextType {
  reviews: Review[];
  getReviewsByProperty: (propertyId: string) => Review[];
  getReviewStats: (propertyId: string) => ReviewStats;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'markedHelpfulBy'>) => void;
  updateReview: (reviewId: string, data: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  toggleHelpful: (reviewId: string, userId: string) => void;
  getUserReview: (propertyId: string, userId: string) => Review | undefined;
  sortReviews: (reviews: Review[], sortBy: ReviewSortOption) => Review[];
  filterReviews: (reviews: Review[], rating: ReviewFilterRating) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

interface ReviewProviderProps {
  children: ReactNode;
}

// Indonesian names for realistic mock data
const mockReviewers = [
  { name: 'Andi Wijaya', avatar: undefined },
  { name: 'Siti Nurhaliza', avatar: undefined },
  { name: 'Budi Santoso', avatar: undefined },
  { name: 'Dewi Lestari', avatar: undefined },
  { name: 'Eko Prasetyo', avatar: undefined },
  { name: 'Fitri Handayani', avatar: undefined },
  { name: 'Gunawan Susilo', avatar: undefined },
  { name: 'Hani Rahmawati', avatar: undefined },
  { name: 'Indra Gunawan', avatar: undefined },
  { name: 'Joko Widodo', avatar: undefined },
  { name: 'Kartika Sari', avatar: undefined },
  { name: 'Linda Permata', avatar: undefined },
  { name: 'Made Sudirman', avatar: undefined },
  { name: 'Nina Kusuma', avatar: undefined },
  { name: 'Omar Abdullah', avatar: undefined },
  { name: 'Putri Amelia', avatar: undefined },
  { name: 'Rizki Ramadhan', avatar: undefined },
  { name: 'Sarah Melati', avatar: undefined },
  { name: 'Tono Sucipto', avatar: undefined },
  { name: 'Umar Bakri', avatar: undefined },
];

const reviewComments = {
  5: [
    'Absolutely amazing property! The location is perfect, facilities are top-notch, and the owner is very responsive. Highly recommended!',
    'One of the best rental experiences I\'ve had. Clean, spacious, and exactly as described. Will definitely stay here again!',
    'Perfect place for families. Very comfortable, safe neighborhood, and close to everything. 10/10 would recommend!',
    'Exceeded all expectations! The property is beautiful, well-maintained, and the owner was incredibly helpful throughout our stay.',
    'Love this place! Great amenities, beautiful interior design, and excellent value for money. Can\'t wait to come back!',
    'Outstanding property in every way. Modern, clean, and in a fantastic location. The owner made check-in super easy.',
    'This is the perfect rental! Spacious rooms, comfortable beds, and a wonderful neighborhood. Highly recommend for anyone!',
    'Amazing experience from start to finish. The property photos don\'t do it justice - it\'s even better in person!',
    'Fantastic property with everything you could need. The owner was very accommodating and communication was excellent.',
  ],
  4: [
    'Great property overall! Very clean and comfortable. Only minor issue was the parking space was a bit tight.',
    'Really enjoyed our stay. The place is nice and the location is convenient. Would stay again!',
    'Good value for money. Property is well-maintained and the owner is professional. Just needs a few minor updates.',
    'Nice place with good facilities. The neighborhood is quiet and safe. Lost one star only because WiFi was a bit slow.',
    'Very comfortable stay. Property matched the description well. Minor improvement areas but overall very satisfied!',
    'Solid choice for a rental. Clean, convenient location, and fair price. Would recommend to friends.',
    'Good experience overall. The property is spacious and has most amenities. A few small things could be better.',
  ],
  3: [
    'Decent property but had some issues with the AC not working properly. Location is good though.',
    'Average experience. Property is okay but could use some maintenance. Price is fair for what you get.',
    'It\'s alright. The location is convenient but the property needs some updates. Not bad, not great.',
  ],
  2: [
    'Property was not as clean as expected. Had to do some cleaning ourselves. Location is the only saving grace.',
  ],
  1: [
    'Very disappointed. Property was not as described and had cleanliness issues. Would not recommend.',
  ],
};

// Generate mock reviews for multiple properties
const generateMockReviews = (): Review[] => {
  const reviews: Review[] = [];
  const propertyIds = ['1', '2', '3', '4', '5']; // Match existing property IDs
  const now = Date.now();
  const sixMonthsAgo = now - (180 * 24 * 60 * 60 * 1000);

  // Rating distribution: 5★: 45%, 4★: 30%, 3★: 15%, 2★: 7%, 1★: 3%
  const ratingDistribution = [
    ...Array(9).fill(5),  // 45%
    ...Array(6).fill(4),  // 30%
    ...Array(3).fill(3),  // 15%
    ...Array(1).fill(2),  // 7%
    ...Array(1).fill(1),  // 3%
  ];

  propertyIds.forEach((propertyId, propIndex) => {
    // 15-20 reviews per property
    const reviewCount = 15 + Math.floor(Math.random() * 6);

    for (let i = 0; i < reviewCount; i++) {
      const rating = ratingDistribution[i % ratingDistribution.length];
      const reviewer = mockReviewers[i % mockReviewers.length];
      const commentOptions = reviewComments[rating as 1 | 2 | 3 | 4 | 5];
      const comment = commentOptions[Math.floor(Math.random() * commentOptions.length)];

      // Random date within last 6 months
      const createdAt = new Date(sixMonthsAgo + Math.random() * (now - sixMonthsAgo));

      // 60% of reviews are verified stays
      const verifiedStay = Math.random() < 0.6;

      // Random helpful count (0-15)
      const helpfulCount = Math.floor(Math.random() * 16);

      reviews.push({
        id: `review-${propIndex}-${i}`,
        propertyId,
        userId: `user-${i % 20}`,
        userName: reviewer.name,
        userAvatar: reviewer.avatar,
        rating,
        comment,
        createdAt,
        helpfulCount,
        verifiedStay,
        markedHelpfulBy: [],
      });
    }
  });

  return reviews;
};

const initialReviews = generateMockReviews();

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const getReviewsByProperty = (propertyId: string): Review[] => {
    return reviews.filter((review) => review.propertyId === propertyId);
  };

  const getReviewStats = (propertyId: string): ReviewStats => {
    const propertyReviews = getReviewsByProperty(propertyId);

    if (propertyReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / propertyReviews.length;

    const ratingDistribution = propertyReviews.reduce(
      (dist, review) => {
        dist[review.rating as 1 | 2 | 3 | 4 | 5]++;
        return dist;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
      averageRating,
      totalReviews: propertyReviews.length,
      ratingDistribution,
    };
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'markedHelpfulBy'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      createdAt: new Date(),
      helpfulCount: 0,
      markedHelpfulBy: [],
    };

    setReviews((prev) => {
      console.log('Added review:', newReview);
      return [newReview, ...prev];
    });
  };

  const updateReview = (reviewId: string, data: Partial<Review>) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, ...data, updatedAt: new Date() }
          : review
      )
    );
    console.log('Updated review:', reviewId);
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => {
      console.log('Deleted review:', reviewId);
      return prev.filter((review) => review.id !== reviewId);
    });
  };

  const toggleHelpful = (reviewId: string, userId: string) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          const markedHelpfulBy = review.markedHelpfulBy || [];
          const isMarked = markedHelpfulBy.includes(userId);

          if (isMarked) {
            // Remove from helpful
            return {
              ...review,
              helpfulCount: Math.max(0, review.helpfulCount - 1),
              markedHelpfulBy: markedHelpfulBy.filter((id) => id !== userId),
            };
          } else {
            // Add to helpful
            return {
              ...review,
              helpfulCount: review.helpfulCount + 1,
              markedHelpfulBy: [...markedHelpfulBy, userId],
            };
          }
        }
        return review;
      })
    );
  };

  const getUserReview = (propertyId: string, userId: string): Review | undefined => {
    return reviews.find(
      (review) => review.propertyId === propertyId && review.userId === userId
    );
  };

  const sortReviews = (reviewsToSort: Review[], sortBy: ReviewSortOption): Review[] => {
    const sorted = [...reviewsToSort];

    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'helpful':
        return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const filterReviews = (reviewsToFilter: Review[], rating: ReviewFilterRating): Review[] => {
    if (rating === 'all') {
      return reviewsToFilter;
    }

    const ratingNum = parseInt(rating, 10);
    return reviewsToFilter.filter((review) => review.rating === ratingNum);
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        getReviewsByProperty,
        getReviewStats,
        addReview,
        updateReview,
        deleteReview,
        toggleHelpful,
        getUserReview,
        sortReviews,
        filterReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
