import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Property } from '../types/Property'; 

interface PropertyWithRanking extends Property {
  rankingScore?: number;
}

// Stateless functional component to render a clickable property card
const PropertyCard = ({ property }: { property: PropertyWithRanking }) => {
  const location = useLocation(); // Access current location to preserve query string

  return (
    // Wrap card in a Link to the property details page, preserving URL search params
    <Link
      to={{
        pathname: `/property/${encodeURIComponent(property.id)}`,
        search: location.search, // Preserve filters/sort queries in URL
      }}
      style={{ textDecoration: 'none', color: 'inherit' }} // Remove default link styles
    >
      <div style={{ border: '1px solid #ccc', padding: '1rem', cursor: 'pointer' }}>
        {/* Display the main address */}
        <h4>{property.formattedAddress}</h4>

        {/* Display property type and basic stats */}
        <p>
          {property.propertyType} | {property.bedrooms} bd / {property.bathrooms} ba
        </p>

        {/* Conditionally show price if it exists */}
        {property.price !== null && property.price !== undefined && (
          <p>Price: ${property.price.toLocaleString()}</p>
        )}

        {/* Show rental yield if available */}
        {property.rentalYield && <p>Rental Yield: {property.rentalYield}%</p>}

        {/* Show investment score if available */}
        {property.investmentScore && <p>Investment Score: {property.investmentScore}/10</p>}

        {/* Show ranking score if not null/undefined, formatted to 2 decimal places */}
        {property.rankingScore !== null && property.rankingScore !== undefined && (
          <p>Ranking Score: {property.rankingScore.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
