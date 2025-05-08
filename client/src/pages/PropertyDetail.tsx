import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getEnrichedProperties } from '../api/loadProperties';
import { getRankedProperties } from '../utils/ranking'; // Import the ranking function
import { Property } from '../types/Property';
import PriceHistoryChart from '../components/PriceHistoryChart';

interface PropertyWithRanking extends Property {
  rankingScore?: number;
}

const sectionStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1.5rem',
  backgroundColor: '#fff',
};

const PropertyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const allProperties: (Property & { rankingScore?: number })[] = getRankedProperties(getEnrichedProperties(), {
    school: 0.15,
    crimeRate: 0.25,
    hospital: 0.10,
    price: 0.15,
    size: 0.35,
    investmentScore: 0.0,
    rentalYield: 0.0,
    daysOnMarket: 0.0,
  }); // Get all properties with ranking
  const property: PropertyWithRanking | undefined = allProperties.find((p) => p.id === id);

  if (!property) return <p style={{ padding: '2rem' }}>Property not found.</p>;

  const {
    formattedAddress,
    propertyType,
    bedrooms,
    bathrooms,
    squareFootage,
    zipCode,
    state,
    yearBuilt,
    lotSize,
    price,
    rent,
    rentalYield,
    investmentScore,
    saleInfo,
    listingAgent,
    listingOffice,
    rankingScore, // Destructure rankingScore
  } = property;

  const hoaFee = saleInfo?.hoa?.fee;
  const mlsName = saleInfo?.mlsName;
  const mlsNumber = saleInfo?.mlsNumber;
  const history = saleInfo?.history;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link
        to={{
          pathname: '/',
          search: location.search, // <- reattaches previous filters
        }}
        style={{
          display: 'inline-block',
          marginBottom: '1rem',
          textDecoration: 'none',
          color: '#007bff',
        }}
      >
        ← Back to search
      </Link>

      <h1 style={{ marginBottom: '0.5rem' }}>{formattedAddress}</h1>
      <h3 style={{ marginTop: 0, color: '#555' }}>
        {propertyType} • {bedrooms} bd • {bathrooms} ba
      </h3>

      <div style={sectionStyle}>
        <h4>Financial Details</h4>
        <p><strong>Price:</strong> {price ? `$${price.toLocaleString()}` : 'N/A'}</p>
        <p><strong>Estimated Rent:</strong> {rent ? `$${rent.toLocaleString()}` : 'N/A'}</p>
        <p><strong>Rental Yield:</strong> {rentalYield ? `${rentalYield}%` : 'N/A'}</p>
        <p><strong>Investment Score:</strong> {investmentScore ?? 'N/A'}/10</p>
        {rankingScore !== undefined && (
          <p><strong>Ranking Score:</strong> {rankingScore.toFixed(2)}</p>
        )}
        {hoaFee && <p><strong>HOA Fee:</strong> ${hoaFee}/mo</p>}
      </div>

      <div style={sectionStyle}>
        <h4>Property Specs</h4>
        <p>
          <strong>Square Footage:</strong> {squareFootage ? `${squareFootage.toLocaleString()} sqft` : 'N/A'}
        </p>
        <p><strong>Lot Size:</strong> {lotSize ? `${lotSize.toLocaleString()} sqft` : 'N/A'}</p>
        <p><strong>Year Built:</strong> {yearBuilt || 'N/A'}</p>
        <p><strong>ZIP Code:</strong> {zipCode}</p>
        <p><strong>State:</strong> {state}</p>
      </div>

      <div style={sectionStyle}>
        <h4>Listing Information</h4>
        {mlsName && mlsNumber && <p><strong>MLS:</strong> {mlsName} #{mlsNumber}</p>}
        {listingAgent && (
          <p>
            <strong>Agent:</strong> {listingAgent.name}
            {listingAgent.phone && ` • ${listingAgent.phone}`}
            {listingAgent.email && ` • ${listingAgent.email}`}
            {listingAgent.website && (
              <>
                <br />
                <a href={listingAgent.website} target="_blank" rel="noopener noreferrer">
                  Agent Website
                </a>
              </>
            )}
          </p>
        )}
        {listingOffice && (
          <p>
            <strong>Office:</strong> {listingOffice.name}
            {listingOffice.phone && ` • ${listingOffice.phone}`}
            {listingOffice.email && ` • ${listingOffice.email}`}
            {listingOffice.website && (
              <>
                <br />
                <a href={listingOffice.website} target="_blank" rel="noopener noreferrer">
                  Office Website
                </a>
              </>
            )}
          </p>
        )}
      </div>

      {history && (
        <div style={sectionStyle}>
          <h4>Price History</h4>
          <PriceHistoryChart history={history} />
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;