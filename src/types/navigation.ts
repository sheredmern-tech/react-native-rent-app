import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Property } from './index';

export type RootStackParamList = {
  Home: undefined;
  PropertyDetail: { property: Property };
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  About: undefined;
  Terms: undefined;
  Privacy: undefined;
  Comparison: undefined;
  Map: undefined;
  NearbyProperties: undefined;
  PropertyReviews: { propertyId: string; propertyTitle: string };
  WriteReview: { propertyId: string; propertyTitle: string };
  EditReview: { reviewId: string; propertyId: string };
  ScheduleVisit: { property: Property };
  MyBookings: undefined;
  BookingDetail: { bookingId: string };
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
