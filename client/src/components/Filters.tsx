import React from 'react';
import SliderFilter from './SliderFilter';

type Props = {
  // Numeric filter values and their corresponding setters
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  minYield: number;
  setMinYield: (val: number) => void;
  sortBy: 'priceDesc' | 'priceAsc' | 'rentDesc' | 'rentAsc' | 'rentalYield' | 'investmentScore' | 'rankingScore' | 'textRelevance';
  setSortBy: (val: Props['sortBy']) => void;
  minBeds: number;
  setMinBeds: (val: number) => void;
  minBaths: number;
  setMinBaths: (val: number) => void;
  propertyType: string;
  setPropertyType: (val: string) => void;
  minSqft: number;
  setMinSqft: (val: number) => void;
  minRent: number;
  setMinRent: (val: number) => void;
  minScore: number;
  setMinScore: (val: number) => void;
  minDaysOnMarket: number;
  setMinDaysOnMarket: (val: number) => void;
  maxDaysOnMarket: number;
  setMaxDaysOnMarket: (val: number) => void;

  // Booleans to toggle filter activation
  enableMinPrice: boolean;
  enableMaxPrice: boolean;
  enableMinYield: boolean;
  enableMinBeds: boolean;
  enableMinBaths: boolean;
  enableMinSqft: boolean;
  enableMinRent: boolean;
  enableMinScore: boolean;
  enableMinDays: boolean;
  enableMaxDays: boolean;

  // Setters to toggle filter activation
  setEnableMinPrice: (enabled: boolean) => void;
  setEnableMaxPrice: (enabled: boolean) => void;
  setEnableMinYield: (enabled: boolean) => void;
  setEnableMinBeds: (enabled: boolean) => void;
  setEnableMinBaths: (enabled: boolean) => void;
  setEnableMinSqft: (enabled: boolean) => void;
  setEnableMinRent: (enabled: boolean) => void;
  setEnableMinScore: (enabled: boolean) => void;
  setEnableMaxDays: (enabled: boolean) => void;
  setEnableMinDays: (enabled: boolean) => void;
};

// Inline CSS for dropdown elements
const dropdownStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem',
  marginTop: '0.5rem',
  fontSize: '0.95rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  appearance: 'none',
};

// Reusable UI group for labeled filter sections
const FilterGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

// Main Filters component
const Filters = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  minYield,
  setMinYield,
  sortBy,
  setSortBy,
  minBeds,
  setMinBeds,
  minBaths,
  setMinBaths,
  propertyType,
  setPropertyType,
  minSqft,
  setMinSqft,
  minScore,
  setMinScore,
  minDaysOnMarket,
  setMinDaysOnMarket,
  maxDaysOnMarket,
  setMaxDaysOnMarket,
  minRent,
  setMinRent,
  enableMinRent,
  setEnableMinRent,
  enableMinDays,
  setEnableMinDays,
  enableMinPrice,
  enableMaxPrice,
  enableMinYield,
  enableMinBeds,
  enableMinBaths,
  enableMinSqft,
  enableMinScore,
  enableMaxDays,
  setEnableMinPrice,
  setEnableMaxPrice,
  setEnableMinYield,
  setEnableMinBeds,
  setEnableMinBaths,
  setEnableMinSqft,
  setEnableMinScore,
  setEnableMaxDays,
}: Props) => {
  return (
    <div>
      {/* Dropdown filter for sort options */}
      <FilterGroup label="Sort By">
        <select
          style={dropdownStyle}
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as Props['sortBy'])
          }
        >
          <option value="priceDesc">Price (High to Low)</option>
          <option value="priceAsc">Price (Low to High)</option>
          <option value="rentDesc">Rent (High to Low)</option>
          <option value="rentAsc">Rent (Low to High)</option>
          <option value="rentalYield">Rental Yield</option>
          <option value="investmentScore">Investment Score</option>
          <option value="rankingScore">Ranking Score</option> {/* Custom ranking metric */}
          <option value="textRelevance">Text Relevance</option>
        </select>
      </FilterGroup>

      {/* Dropdown for selecting property type */}
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

      {/* Range sliders for numeric filters with enable toggles */}
      <SliderFilter label="Min Price" value={minPrice} setValue={setMinPrice} min={0} max={2000000} step={10000} prefix="$" enabled={enableMinPrice} setEnabled={setEnableMinPrice} />
      <SliderFilter label="Max Price" value={maxPrice} setValue={setMaxPrice} min={50000} max={5000000} step={50000} prefix="$" enabled={enableMaxPrice} setEnabled={setEnableMaxPrice} />
      <SliderFilter label="Min Bedrooms" value={minBeds} setValue={setMinBeds} min={0} max={10} step={1} enabled={enableMinBeds} setEnabled={setEnableMinBeds} />
      <SliderFilter label="Min Bathrooms" value={minBaths} setValue={setMinBaths} min={0} max={10} step={0.5} enabled={enableMinBaths} setEnabled={setEnableMinBaths} />
      <SliderFilter label="Min Sqft" value={minSqft} setValue={setMinSqft} min={0} max={10000} step={100} enabled={enableMinSqft} setEnabled={setEnableMinSqft} />
      <SliderFilter label="Min Rent" value={minRent} setValue={setMinRent} min={0} max={10000} step={100} prefix="$" enabled={enableMinRent} setEnabled={setEnableMinRent} />
      <SliderFilter label="Min Days on Market" value={minDaysOnMarket} setValue={setMinDaysOnMarket} min={0} max={3650} step={5} enabled={enableMinDays} setEnabled={setEnableMinDays} />
      <SliderFilter label="Max Days on Market" value={maxDaysOnMarket} setValue={setMaxDaysOnMarket} min={0} max={3650} step={5} enabled={enableMaxDays} setEnabled={setEnableMaxDays} />
      <SliderFilter label="Min InvestmentScore" value={minScore} setValue={setMinScore} min={0} max={10} step={0.1} enabled={enableMinScore} setEnabled={setEnableMinScore} />
      <SliderFilter label="Min Rental Yield" value={minYield} setValue={setMinYield} min={0} max={20} step={0.1} suffix="%" enabled={enableMinYield} setEnabled={setEnableMinYield} />
    </div>
  );
};

export default Filters;
