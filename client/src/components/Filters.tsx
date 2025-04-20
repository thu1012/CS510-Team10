import React from 'react'
import FilterGroup from './FilterGroup'

type Props = {
  minPrice: number
  maxPrice: number
  setMinPrice: (v: number) => void
  setMaxPrice: (v: number) => void
  minYield: number
  setMinYield: (v: number) => void
  sortBy: string
  setSortBy: (v: any) => void
  minBeds: number
  setMinBeds: (v: number) => void
  minBaths: number
  setMinBaths: (v: number) => void
}

const inputStyle = {
  width: '100%',
  padding: '0.4rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginRight: '1rem'
}

const sliderStyle = {
  width: '100%',
  marginTop: '0.5rem'
}

const Filters = ({
  minPrice, maxPrice, setMinPrice, setMaxPrice,
  minYield, setMinYield,
  sortBy, setSortBy,
  minBeds, setMinBeds,
  minBaths, setMinBaths
}: Props) => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Filters</h3>

      <FilterGroup label={`Min Price: $${minPrice.toLocaleString()}`}>
        <input
          type="range"
          style={sliderStyle}
          min={0}
          max={2000000}
          step={10000}
          value={minPrice}
          onChange={(e) => setMinPrice(+e.target.value)}
        />
      </FilterGroup>

      <FilterGroup label={`Max Price: $${maxPrice.toLocaleString()}`}>
        <input
          type="range"
          style={sliderStyle}
          min={minPrice}
          max={2000000}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
        />
      </FilterGroup>

      <FilterGroup label={`Min Bedrooms: ${minBeds}`}>
        <input
          type="range"
          style={sliderStyle}
          min={0}
          max={10}
          step={1}
          value={minBeds}
          onChange={(e) => setMinBeds(+e.target.value)}
        />
      </FilterGroup>

      <FilterGroup label={`Min Bathrooms: ${minBaths}`}>
        <input
          type="range"
          style={sliderStyle}
          min={0}
          max={10}
          step={0.5}
          value={minBaths}
          onChange={(e) => setMinBaths(+e.target.value)}
        />
      </FilterGroup>

      <FilterGroup label={`Min Rental Yield (%): ${minYield}`}>
        <input
          type="range"
          style={sliderStyle}
          min={0}
          max={20}
          step={0.1}
          value={minYield}
          onChange={(e) => setMinYield(+e.target.value)}
        />
      </FilterGroup>

      <FilterGroup label="Sort By">
        <select style={inputStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="price">Price</option>
          <option value="rentalYield">Rental Yield</option>
          <option value="investmentScore">Investment Score</option>
        </select>
      </FilterGroup>
    </div>
  )
}

export default Filters
