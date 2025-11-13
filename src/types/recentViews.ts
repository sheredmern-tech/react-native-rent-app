export interface RecentView {
  propertyId: string;
  viewedAt: Date;
}

export interface RecentViewsContextType {
  recentViews: RecentView[];
  loading: boolean;
  addRecentView: (propertyId: string) => Promise<void>;
  getRecentViews: () => RecentView[];
  clearRecentViews: () => Promise<void>;
  removeRecentView: (propertyId: string) => Promise<void>;
  isRecentlyViewed: (propertyId: string) => boolean;
}
