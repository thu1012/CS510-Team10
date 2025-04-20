import React, { useState } from 'react'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { getEnrichedProperties } from '../api/loadProperties'
import { Property } from '../types/Property'

const Home = () => {
  const [sortBy, setSortBy] = useState<'price' | 'rentalYield' | 'investmentScore'>('investmentScore')
  const [minPrice, setMinPrice] = useState(1)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [minYield, setMinYield] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const allProperties: Property[] = getEnrichedProperties()

  const query = searchQuery.toLowerCase()

  const filtered = allProperties
    .filter((p) =>
      (p.price ?? 0) >= minPrice &&
      (p.price ?? 0) <= maxPrice &&
      (p.rentalYield ?? 0) >= minYield &&
      (p.bedrooms ?? 0) >= minBeds &&
      (p.bathrooms ?? 0) >= minBaths &&
      (
        p.formattedAddress?.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.zipCode?.toLowerCase().includes(query)
      )
    )
    .sort((a, b) => {
      const aVal = a[sortBy as keyof Property] as number ?? 0
      const bVal = b[sortBy as keyof Property] as number ?? 0
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
