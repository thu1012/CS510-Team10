export interface Property {
  id: string
  formattedAddress: string
  city: string
  state: string
  zipCode: string
  bedrooms: number
  bathrooms: number
  squareFootage?: number
  propertyType: string
  price?: number
  rentalYield?: number
  appreciationScore?: number
  investmentScore?: number
  ownerOccupied?: boolean
}
