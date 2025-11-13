export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface PropertyMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  price: number;
  type: 'apartment' | 'house' | 'villa';
}

export type LocationPermission = 'granted' | 'denied' | 'undetermined';

export interface UserLocation {
  latitude: number;
  longitude: number;
}
