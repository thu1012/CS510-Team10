export type Property = {
  id: string
  formattedAddress: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  zipCode?: string
  latitude?: number
  longitude?: number
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  squareFootage?: number
  lotSize?: number
  yearBuilt?: number
  price?: number
  rent?: number
  rentalYield?: number
  investmentScore?: number
  daysOnMarket?: number
  status?: string

  saleInfo?: {
    price?: number
    status?: string
    bedrooms?: number
    bathrooms?: number
    squareFootage?: number
    yearBuilt?: number
    lotSize?: number
    propertyType?: string
    latitude?: number
    longitude?: number
    city?: string
    state?: string
    zipCode?: string
    daysOnMarket?: number
    hoa?: { fee?: number }
    mlsName?: string
    mlsNumber?: string
    history?: Record<string, {
      event: string
      price: number
      listingType: string
      listedDate: string
      removedDate: string | null
      daysOnMarket: number
    }>
    listingAgent?: {
      name: string
      phone?: string
      email?: string
      website?: string
    }
    listingOffice?: {
      name: string
      phone?: string
      email?: string
      website?: string
    }
  }

  rentInfo?: {
    price?: number
    status?: string
    bedrooms?: number
    bathrooms?: number
    city?: string
    state?: string
    zipCode?: string
    latitude?: number
    longitude?: number
    listedDate?: string
    removedDate?: string
    createdDate?: string
    lastSeenDate?: string
    daysOnMarket?: number
    history?: Record<string, {
      event: string
      price: number
      listingType: string
      listedDate: string
      removedDate: string | null
      daysOnMarket: number
    }>
  }

  listingAgent?: {
    name: string
    phone?: string
    email?: string
    website?: string
  }

  listingOffice?: {
    name: string
    phone?: string
    email?: string
    website?: string
  }

  history?: Record<string, {
    event: string
    price: number
    listingType: string
    listedDate: string
    removedDate: string | null
    daysOnMarket: number
  }>
}
