import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEnrichedProperties } from '../api/loadProperties'
import { Property } from '../types/Property'
import PriceHistoryChart from '../components/PriceHistoryChart'

const sectionStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1.5rem',
  backgroundColor: '#fff'
}

const PropertyDetail = () => {
  const { id } = useParams()
  const allProperties: Property[] = getEnrichedProperties()
  const property = allProperties.find((p) => p.id === id)

  if (!property) return <p style={{ padding: '2rem' }}>Property not found.</p>

  const saleData = require('../data/sale.json')
  const saleRecord = saleData.find((s: any) => s.formattedAddress === property?.formattedAddress)

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', textDecoration: 'none', color: '#007bff' }}>
        ← Back to search
      </Link>

      <h1 style={{ marginBottom: '0.5rem' }}>{property.formattedAddress}</h1>
      <h3 style={{ marginTop: 0, color: '#555' }}>{property.propertyType} • {property.bedrooms} bd • {property.bathrooms} ba</h3>

      <div style={sectionStyle}>
        <h4>Financial Details</h4>
        <p><strong>Price:</strong> ${property.price?.toLocaleString()}</p>
        <p><strong>Rental Yield:</strong> {property.rentalYield}%</p>
        <p><strong>Investment Score:</strong> {property.investmentScore}/10</p>
      </div>

      <div style={sectionStyle}>
        <h4>Property Specs</h4>
        <p><strong>Square Footage:</strong> {property.squareFootage ?? 'N/A'}</p>
        <p><strong>ZIP Code:</strong> {property.zipCode}</p>
        <p><strong>State:</strong> {property.state}</p>
      </div>

      <div style={sectionStyle}>
        <h4>Owner & Occupancy</h4>
        <p><strong>Owner Occupied:</strong> {property.ownerOccupied ? 'Yes' : 'No'}</p>
        {/* You can add owner name/mailing address from original JSON if needed */}
      </div>

      {saleRecord?.history && (
        <div style={sectionStyle}>
          <h4>Price History</h4>
          <PriceHistoryChart history={saleRecord.history} />
        </div>
      )}
    </div>
  )
}

export default PropertyDetail
