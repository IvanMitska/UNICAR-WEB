export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'economy' | 'comfort' | 'business' | 'premium' | 'suv' | 'sport' | 'electric';
  pricePerDay: number;
  image: string;
  imagePosition?: string;
  images: string[];
  features: string[];
  transmission: 'manual' | 'automatic';
  fuel: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  seats: number;
  luggage: number;
  available: boolean;
  rating: number;
  reviews: number;
  description: string;
  discount?: boolean;
  color?: string;
  licensePlate?: string;
  longTermOnly?: boolean;
  byRequest?: boolean;
  specifications: {
    engine: string;
    power: string;
    acceleration: string;
    topSpeed: string;
  };
}

export interface Booking {
  id: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;
  additionalServices: AdditionalService[];
  customer: Customer;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  priceType: 'perDay' | 'oneTime';
  selected: boolean;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  driverLicense: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Review {
  id: string;
  carId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'scooter' | 'sport' | 'touring' | 'cruiser' | 'adventure';
  pricePerDay: number;
  image: string;
  images: string[];
  features: string[];
  transmission: 'manual' | 'automatic';
  fuel: 'petrol' | 'electric';
  engineSize: string;
  available: boolean;
  rating: number;
  reviews: number;
  description: string;
  specifications: {
    engine: string;
    power: string;
    topSpeed: string;
    fuelTank: string;
  };
}