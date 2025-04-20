import React, { useState } from 'react'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { getEnrichedProperties } from '../api/loadProperties'

const Home = () => {
  const [sortBy, setSortBy] = useState<'priceDesc' | 'priceAsc' | 'rentalYield' | 'investmentScore'>('investmentScore')
  const [minPrice, setMinPrice] = useState(1)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [minSqft, setMinSqft] = useState(0)
  const [minScore, setMinScore] = useState(0)
  const [minYield, setMinYield] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [maxDaysOnMarket, setMaxDaysOnMarket] = useState(365)

  const allProperties: Property[] = getEnrichedProperties()

  const query = searchQuery.toLowerCase()

  const filtered = allProperties
    .filter((p) =>
      (p.price ?? 0) >= minPrice &&
      (p.price ?? 0) <= maxPrice &&
      (p.rentalYield ?? 0) >= minYield &&
      (p.bedrooms ?? 0) >= minBeds &&
      (p.bathrooms ?? 0) >= minBaths &&
      (p.propertyType?.toLowerCase().includes(propertyType.toLowerCase())) &&
      (p.squareFootage ?? 0) >= minSqft &&
      (p.investmentScore ?? 0) >= minScore &&
      (p.daysOnMarket ?? Infinity) <= maxDaysOnMarket &&
      (
        p.formattedAddress?.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.zipCode?.toLowerCase().includes(query)
      )
    )
    .sort((a, b) => {
      const key = sortBy.startsWith('price') ? 'price' : sortBy
      const aVal = a[key as keyof Property] as number ?? 0
      const bVal = b[key as keyof Property] as number ?? 0
      
      if (sortBy === 'priceAsc') {
        return aVal - bVal
      }
      return bVal - aVal 
    })

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', backgroundColor: '#f2f2f2', padding: '1rem' }}>
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          minYield={minYield}
          setMinYield={setMinYield}
          sortBy={sortBy}
          setSortBy={setSortBy}
          minBeds={minBeds}
          setMinBeds={setMinBeds}
          minBaths={minBaths}
          setMinBaths={setMinBaths}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          minSqft={minSqft}
          setMinSqft={setMinSqft}
          minScore={minScore}
          setMinScore={setMinScore}
          maxDaysOnMarket={maxDaysOnMarket}
          setMaxDaysOnMarket={setMaxDaysOnMarket}
        />
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
        <div style={{ paddingRight: '1.5rem' }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <h3>Search Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {filtered.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home

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