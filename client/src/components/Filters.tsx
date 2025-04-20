import React from 'react'
import SliderFilter from './SliderFilter'

type Props = {
  minPrice: number
  maxPrice: number
  setMinPrice: (val: number) => void
  setMaxPrice: (val: number) => void
  minYield: number
  setMinYield: (val: number) => void
  sortBy: 'price' | 'rentalYield' | 'investmentScore'
  setSortBy: (val: 'price' | 'rentalYield' | 'investmentScore') => void
  minBeds: number
  setMinBeds: (val: number) => void
  minBaths: number
  setMinBaths: (val: number) => void
  propertyType: string
  setPropertyType: (val: string) => void
  minSqft: number
  setMinSqft: (val: number) => void
  minScore: number
  setMinScore: (val: number) => void
  maxDaysOnMarket: number
  setMaxDaysOnMarket: (val: number) => void
}

const dropdownStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem',
  marginTop: '0.5rem',
  fontSize: '0.95rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  appearance: 'none'
}

const FilterGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</label>
    {children}
  </div>
)

const Filters = ({
  minPrice, maxPrice, setMinPrice, setMaxPrice,
  minYield, setMinYield, sortBy, setSortBy,
  minBeds, setMinBeds, minBaths, setMinBaths,
  propertyType, setPropertyType,
  minSqft, setMinSqft, minScore, setMinScore,
  maxDaysOnMarket, setMaxDaysOnMarket
}: Props) => {
  return (
    <div>
      <FilterGroup label="Sort By">
        <select
          style={dropdownStyle}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price' | 'rentalYield' | 'investmentScore')}
        >
          <option value="price">Price</option>
          <option value="rentalYield">Rental Yield</option>
          <option value="investmentScore">Investment Score</option>
        </select>
      </FilterGroup>

      <FilterGroup label="Property Type">
        <select
          style={dropdownStyle}
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">All</option>
          <option value="Single Family">Single Family</option>
          <option value="Condo">Condo</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Multi-Family">Multi-Family</option>
        </select>
      </FilterGroup>

      <SliderFilter label="Min Price" value={minPrice} setValue={setMinPrice} min={0} max={2000000} step={10000} prefix="$" />
      <SliderFilter label="Max Price" value={maxPrice} setValue={setMaxPrice} min={50000} max={5000000} step={50000} prefix="$" />
      <SliderFilter label="Min Rental Yield" value={minYield} setValue={setMinYield} min={0} max={20} step={0.1} suffix="%" />
      <SliderFilter label="Min Bedrooms" value={minBeds} setValue={setMinBeds} min={0} max={10} step={1} />
      <SliderFilter label="Min Bathrooms" value={minBaths} setValue={setMinBaths} min={0} max={10} step={0.5} />
      <SliderFilter label="Min Sqft" value={minSqft} setValue={setMinSqft} min={0} max={10000} step={100} />
      <SliderFilter label="Min Score" value={minScore} setValue={setMinScore} min={0} max={10} step={0.1} />
      <SliderFilter label="Max Days on Market" value={maxDaysOnMarket} setValue={setMaxDaysOnMarket} min={0} max={3650} step={5} />
    </div>
  )
}

export default Filters