/**
 * Cars API client for UNICAR website
 * Connects to UNICAR-Table CRM backend
 */

import type { Car } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface ApiError {
  error: string
}

interface BookingResponse {
  referenceCode: string
  status: string
  message: string
}

interface BookingStatusResponse {
  referenceCode: string
  status: 'pending' | 'confirmed' | 'rejected' | 'completed'
  vehicle: {
    brand: string
    model: string
    year: number
  }
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
  totalPrice: number
  createdAt: string
}

interface AdditionalService {
  id: string
  name: string
  price: number
  perDay: boolean
}

interface CreateBookingData {
  vehicleId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  customerBirthDate?: string
  customerLicenseNumber?: string
  customerLicenseIssueDate?: string
  startDate: string
  endDate: string
  pickupLocation: string
  returnLocation: string
  additionalServices?: AdditionalService[]
  totalPrice: number
}

class CarsApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'CarsApiError'
    this.status = status
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Unknown error' })) as ApiError
    throw new CarsApiError(data.error || `HTTP ${response.status}`, response.status)
  }
  return response.json() as Promise<T>
}

export const carsApi = {
  /**
   * Get all cars available for website display
   */
  async getCars(filters?: { category?: string }): Promise<Car[]> {
    const url = new URL(`${API_URL}/api/public/cars`)

    const response = await fetch(url.toString())
    const cars = await handleResponse<Car[]>(response)

    // Apply client-side filtering if needed
    if (filters?.category && filters.category !== 'all') {
      const categoryMap: Record<string, string[]> = {
        'premium': ['premium'],
        'sport': ['sport'],
        'suv': ['suv'],
        'economy': ['economy'],
        'luxury': ['premium', 'sport'],
        'luxury-suv': ['suv'],
      }
      const allowedCategories = categoryMap[filters.category] || [filters.category]
      return cars.filter(car => allowedCategories.includes(car.category))
    }

    return cars
  },

  /**
   * Get single car by ID
   */
  async getCarById(id: string): Promise<Car> {
    const response = await fetch(`${API_URL}/api/public/cars/${id}`)
    return handleResponse<Car>(response)
  },

  /**
   * Get cars available for specific date range
   */
  async checkAvailability(startDate: Date, endDate: Date): Promise<Car[]> {
    const url = new URL(`${API_URL}/api/public/cars/available`)
    url.searchParams.set('startDate', startDate.toISOString().split('T')[0])
    url.searchParams.set('endDate', endDate.toISOString().split('T')[0])

    const response = await fetch(url.toString())
    return handleResponse<Car[]>(response)
  },

  /**
   * Create a new booking request
   */
  async createBooking(data: CreateBookingData): Promise<BookingResponse> {
    const response = await fetch(`${API_URL}/api/public/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return handleResponse<BookingResponse>(response)
  },

  /**
   * Get booking status by reference code
   */
  async getBookingStatus(referenceCode: string): Promise<BookingStatusResponse> {
    const response = await fetch(`${API_URL}/api/public/bookings/${referenceCode}/status`)
    return handleResponse<BookingStatusResponse>(response)
  },

  /**
   * Check if a specific car is available for dates
   */
  async isCarAvailable(carId: string, startDate: Date, endDate: Date): Promise<boolean> {
    try {
      const availableCars = await this.checkAvailability(startDate, endDate)
      return availableCars.some(car => car.id === carId)
    } catch {
      return false
    }
  },
}

export type { BookingResponse, BookingStatusResponse, CreateBookingData, AdditionalService }
export { CarsApiError }
