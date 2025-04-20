import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Property } from '../types/Property'

const PropertyCard = ({ property }: { property: Property }) => {
  const location = useLocation()
  
  return (
    <Link
      to={{
        pathname: `/property/${encodeURIComponent(property.id)}`,
        search: location.search 
      }}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{ border: '1px solid #ccc', padding: '1rem', cursor: 'pointer' }}>
        <h4>{property.formattedAddress}</h4>
        <p>{property.propertyType} | {property.bedrooms} bd / {property.bathrooms} ba</p>
        <p>Price: ${property.price?.toLocaleString()}</p>
        {property.rent && <p>Rent: ${property.rent.toLocaleString()}</p>}
        {property.rentalYield && <p>Rental Yield: {property.rentalYield}%</p>}
        {property.investmentScore && <p>Investment Score: {property.investmentScore}/10</p>}
      </div>
    </Link>
  )
}

export default PropertyCard
