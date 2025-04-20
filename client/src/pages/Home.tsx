import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'
import { getEnrichedProperties } from '../api/loadProperties'
import { Property } from '../types/Property'

const Home = () => {
  const [sortBy, setSortBy] = useState<'priceDesc' | 'priceAsc' | 'rentalYield' | 'investmentScore'>('investmentScore')
  const [minPrice, setMinPrice] = useState(1)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [minRent, setMinRent] = useState(0)
  const [minYield, setMinYield] = useState(0)
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [minSqft, setMinSqft] = useState(0)
  const [minScore, setMinScore] = useState(0)
  const [minDaysOnMarket, setMinDaysOnMarket] = useState(0)
  const [maxDaysOnMarket, setMaxDaysOnMarket] = useState(365)
  const [searchQuery, setSearchQuery] = useState('')

  const [enableMinPrice, setEnableMinPrice] = useState(true)
  const [enableMaxPrice, setEnableMaxPrice] = useState(true)
  const [enableMinRent, setEnableMinRent] = useState(false)
  const [enableMinYield, setEnableMinYield] = useState(false)
  const [enableMinBeds, setEnableMinBeds] = useState(false)
  const [enableMinBaths, setEnableMinBaths] = useState(false)
  const [enableMinSqft, setEnableMinSqft] = useState(false)
  const [enableMinScore, setEnableMinScore] = useState(false)
  const [enableMinDays, setEnableMinDays] = useState(false)
  const [enableMaxDays, setEnableMaxDays] = useState(false)

  const [hydrated, setHydrated] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const getParam = (key: string, fallback: number) =>
      parseFloat(searchParams.get(key) || '') || fallback
  
    const getBoolParam = (key: string, fallback = true) =>
      searchParams.get(key) === 'false' ? false : fallback

    const isFirstVisit = searchParams.size === 0
  
    setMinPrice(getParam('minPrice', 1))
    setMaxPrice(getParam('maxPrice', 1000000))
    setMinRent(getParam('minRent', 0))
    setMinYield(getParam('minYield', 0))
    setMinBeds(getParam('minBeds', 0))
    setMinBaths(getParam('minBaths', 0))
    setMinSqft(getParam('minSqft', 0))
    setMinScore(getParam('minScore', 0))
    setMinDaysOnMarket(getParam('minDaysOnMarket', 0))
    setMaxDaysOnMarket(getParam('maxDaysOnMarket', 365))
    setSortBy((searchParams.get('sortBy') as any) || 'investmentScore')
    setPropertyType(searchParams.get('propertyType') || '')
    setSearchQuery(searchParams.get('q') || '')
  
    setEnableMinPrice(getBoolParam('enableMinPrice', true))
    setEnableMaxPrice(getBoolParam('enableMaxPrice', true))
    setEnableMinRent(getBoolParam('enableMinRent', !isFirstVisit))
    setEnableMinYield(getBoolParam('enableMinYield', !isFirstVisit))
    setEnableMinBeds(getBoolParam('enableMinBeds', !isFirstVisit))
    setEnableMinBaths(getBoolParam('enableMinBaths', !isFirstVisit))
    setEnableMinSqft(getBoolParam('enableMinSqft', !isFirstVisit))
    setEnableMinScore(getBoolParam('enableMinScore', !isFirstVisit))
    setEnableMinDays(getBoolParam('enableMinDays', !isFirstVisit))
    setEnableMaxDays(getBoolParam('enableMaxDays', !isFirstVisit))
  
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
  
    setSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      minRent: minRent.toString(),
      minYield: minYield.toString(),
      minBeds: minBeds.toString(),
      minBaths: minBaths.toString(),
      minSqft: minSqft.toString(),
      minScore: minScore.toString(),
      minDaysOnMarket: minDaysOnMarket.toString(),
      maxDaysOnMarket: maxDaysOnMarket.toString(),
      sortBy,
      propertyType,
      q: searchQuery,
  
      enableMinPrice: enableMinPrice.toString(),
      enableMaxPrice: enableMaxPrice.toString(),
      enableMinRent: enableMinRent.toString(),
      enableMinYield: enableMinYield.toString(),
      enableMinBeds: enableMinBeds.toString(),
      enableMinBaths: enableMinBaths.toString(),
      enableMinSqft: enableMinSqft.toString(),
      enableMinScore: enableMinScore.toString(),
      enableMinDays: enableMinDays.toString(),
      enableMaxDays: enableMaxDays.toString(),
    })
  }, [
    hydrated,
    minPrice, maxPrice, minRent, minYield,
    minBeds, minBaths, minSqft, minScore,
    minDaysOnMarket, maxDaysOnMarket,
    sortBy, propertyType, searchQuery,
    enableMinPrice, enableMaxPrice, enableMinRent,
    enableMinYield, enableMinBeds, enableMinBaths,
    enableMinSqft, enableMinScore, enableMinDays, enableMaxDays
  ])

  const allProperties: Property[] = getEnrichedProperties()
  const query = searchQuery.toLowerCase()

  const filtered = allProperties
    .filter((p) =>
      (!enableMinPrice || (p.price ?? 0) >= minPrice) &&
      (!enableMaxPrice || (p.price ?? 0) <= maxPrice) &&
      (!enableMinRent || (p.rent ?? 0) >= minRent) &&
      (!enableMinYield || (p.rentalYield ?? 0) >= minYield) &&
      (!enableMinBeds || (p.bedrooms ?? 0) >= minBeds) &&
      (!enableMinBaths || (p.bathrooms ?? 0) >= minBaths) &&
      (!enableMinSqft || (p.squareFootage ?? 0) >= minSqft) &&
      (!enableMinScore || (p.investmentScore ?? 0) >= minScore) &&
      (!enableMinDays || (p.daysOnMarket ?? 0) >= minDaysOnMarket) &&
      (!enableMaxDays || (p.daysOnMarket ?? Infinity) <= maxDaysOnMarket) &&
      (p.propertyType?.toLowerCase().includes(propertyType.toLowerCase())) &&
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
          minRent={minRent}
          setMinRent={setMinRent}
          minDaysOnMarket={minDaysOnMarket}
          setMinDaysOnMarket={setMinDaysOnMarket}
          maxDaysOnMarket={maxDaysOnMarket}
          setMaxDaysOnMarket={setMaxDaysOnMarket}

          enableMinPrice={enableMinPrice}
          enableMaxPrice={enableMaxPrice}
          enableMinRent={enableMinRent}
          enableMinYield={enableMinYield}
          enableMinBeds={enableMinBeds}
          enableMinBaths={enableMinBaths}
          enableMinSqft={enableMinSqft}
          enableMinScore={enableMinScore}
          enableMinDays={enableMinDays}
          enableMaxDays={enableMaxDays}
          setEnableMinPrice={setEnableMinPrice}
          setEnableMaxPrice={setEnableMaxPrice}
          setEnableMinRent={setEnableMinRent}
          setEnableMinYield={setEnableMinYield}
          setEnableMinBeds={setEnableMinBeds}
          setEnableMinBaths={setEnableMinBaths}
          setEnableMinSqft={setEnableMinSqft}
          setEnableMinScore={setEnableMinScore}
          setEnableMinDays={setEnableMinDays}
          setEnableMaxDays={setEnableMaxDays}
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
