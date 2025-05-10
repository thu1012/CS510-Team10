import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getEnrichedProperties } from '../api/loadProperties'; // Import the function to fetch and enrich property data.
import { getRankedProperties } from '../utils/ranking'; // Import the function to rank properties based on defined criteria.
import { Property } from '../types/Property'; // Import the type definition for a property object.
import PriceHistoryChart from '../components/PriceHistoryChart'; // Import the component to display the price history of a property.

// Interface extending the base Property type to include an optional ranking score.
interface PropertyWithRanking extends Property {
  rankingScore?: number;
}

// Style object for the sections containing property details.
const sectionStyle = {
  border: '1px solid #ccc', // Solid border with light gray color.
  borderRadius: '8px', // Rounded corners for a softer appearance.
  padding: '1rem', // Padding inside the section for spacing.
  marginBottom: '1.5rem', // Margin below each section for spacing.
  backgroundColor: '#fff', // White background color.
};

// Component to display the detailed information for a single property.
const PropertyDetail = () => {
  // Extracts the property ID from the URL parameters.
  const { id } = useParams();
  // Provides access to the current URL's location object, used here to preserve search params for the back link.
  const location = useLocation();
  // Fetches all enriched properties and then ranks them using the getRankedProperties function.
  const allProperties: (Property & { rankingScore?: number })[] = getRankedProperties(getEnrichedProperties(), {
    school: 0.15, // Weight for school proximity in the ranking.
    crimeRate: 0.25, // Weight for crime rate in the ranking.
    hospital: 0.10, // Weight for hospital proximity in the ranking.
    price: 0.15, // Weight for price in the ranking.
    size: 0.35, // Weight for size (square footage) in the ranking.
    investmentScore: 0.0, // Weight for the pre-calculated investment score.
    rentalYield: 0.0, // Weight for the rental yield.
    daysOnMarket: 0.0, // Weight for the number of days the property has been on the market.
  }); // Get all properties with ranking
  // Finds the specific property from the ranked list based on the ID from the URL.
  const property: PropertyWithRanking | undefined = allProperties.find((p) => p.id === id);

  // If the property with the given ID is not found, display a "Property not found" message.
  if (!property) return <p style={{ padding: '2rem' }}>Property not found.</p>;

  // Destructures various properties from the found property object.
  const {
    formattedAddress, // The formatted address of the property.
    propertyType, // The type of property (e.g., house, apartment).
    bedrooms, // Number of bedrooms.
    bathrooms, // Number of bathrooms.
    squareFootage, // Square footage of the property.
    zipCode, // ZIP code of the property.
    state, // State of the property.
    yearBuilt, // Year the property was built.
    lotSize, // Size of the property's lot.
    price, // Price of the property.
    rent, // Estimated rent for the property.
    rentalYield, // Calculated rental yield.
    investmentScore, // Pre-calculated investment score.
    saleInfo, // Object containing sale-related information.
    listingAgent, // Information about the listing agent.
    listingOffice, // Information about the listing office.
    description, // Description of the property.
    rankingScore, // Calculated ranking score.
  } = property;

  // Extracts the HOA fee from the sale information, if available.
  const hoaFee = saleInfo?.hoa?.fee;
  // Extracts the MLS name from the sale information, if available.
  const mlsName = saleInfo?.mlsName;
  // Extracts the MLS number from the sale information, if available.
  const mlsNumber = saleInfo?.mlsNumber;
  // Extracts the price history from the sale information, if available.
  const history = saleInfo?.history;

  // Renders the main container for the property details page.
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Link to navigate back to the search results page, preserving the current filters. */}
      <Link
        to={{
          pathname: '/',
          search: location.search, // <- reattaches previous filters
        }}
        style={{
          display: 'inline-block', // Make the link behave like a block element for better styling.
          marginBottom: '1rem', // Add some margin below the link.
          textDecoration: 'none', // Remove the default underline.
          color: '#007bff', // Use a blue color, typically used for links.
        }}
      >
        ← Back to search
      </Link>

      {/* Displays the formatted address of the property as the main heading. */}
      <h1 style={{ marginBottom: '0.5rem' }}>{formattedAddress}</h1>
      {/* Displays basic property information like type, bedrooms, and bathrooms. */}
      <h3 style={{ marginTop: 0, color: '#555' }}>
        {propertyType} • {bedrooms} bd • {bathrooms} ba
      </h3>

      {/* Section displaying financial details of the property. */}
      <div style={sectionStyle}>
        <h4>Financial Details</h4>
        <p><strong>Price:</strong> {price ? `$${price.toLocaleString()}` : 'N/A'}</p> {/* Format price with commas. */}
        <p><strong>Estimated Rent:</strong> {rent ? `$${rent.toLocaleString()}` : 'N/A'}</p> {/* Format rent with commas. */}
        <p><strong>Rental Yield:</strong> {rentalYield ? `${rentalYield}%` : 'N/A'}</p> {/* Display rental yield, if available. */}
        <p><strong>Investment Score:</strong> {investmentScore ?? 'N/A'}/10</p> {/* Display investment score. */}
        {/* Conditionally renders the ranking score if it exists. */}
        {rankingScore !== undefined && (
          <p><strong>Ranking Score:</strong> {rankingScore.toFixed(2)}</p> // Display ranking score with two decimal places.
        )}
        {/* Conditionally renders the HOA fee if it exists. */}
        {hoaFee && <p><strong>HOA Fee:</strong> ${hoaFee}/mo</p>}
      </div>

      {/* Section displaying property specifications. */}
      <div style={sectionStyle}>
        <h4>Property Specs</h4>
        <p>
          <strong>Square Footage:</strong> {squareFootage ? `${squareFootage.toLocaleString()} sqft` : 'N/A'} {/* Format square footage. */}
        </p>
        <p><strong>Lot Size:</strong> {lotSize ? `${lotSize.toLocaleString()} sqft` : 'N/A'}</p> {/* Format lot size. */}
        <p><strong>Year Built:</strong> {yearBuilt || 'N/A'}</p> {/* Display year built, if available. */}
        <p><strong>ZIP Code:</strong> {zipCode}</p> {/* Display ZIP code. */}
        <p><strong>State:</strong> {state}</p> {/* Display state. */}
      </div>

      {/* Conditionally renders the property description if it exists. */}
      {description && (
        <div style={sectionStyle}>
          <h4>Property Description</h4>
          <ExpandableDescription description={description} /> {/* Use the ExpandableDescription component. */}
        </div>
      )}

      {/* Section displaying listing agent and office information. */}
      <div style={sectionStyle}>
        <h4>Listing Information</h4>
        {/* Conditionally renders MLS information if available. */}
        {mlsName && mlsNumber && <p><strong>MLS:</strong> {mlsName} #{mlsNumber}</p>}
        {/* Conditionally renders listing agent information if available. */}
        {listingAgent && (
          <p>
            <strong>Agent:</strong> {listingAgent.name}
            {listingAgent.phone && ` • ${listingAgent.phone}`} {/* Display phone if available. */}
            {listingAgent.email && ` • ${listingAgent.email}`} {/* Display email if available. */}
            {listingAgent.website && (
              <>
                <br />
                <a href={listingAgent.website} target="_blank" rel="noopener noreferrer"> {/* Link to agent's website. */}
                  Agent Website
                </a>
              </>
            )}
          </p>
        )}
        {/* Conditionally renders listing office information if available. */}
        {listingOffice && (
          <p>
            <strong>Office:</strong> {listingOffice.name}
            {listingOffice.phone && ` • ${listingOffice.phone}`} {/* Display phone if available. */}
            {listingOffice.email && ` • ${listingOffice.email}`} {/* Display email if available. */}
            {listingOffice.website && (
              <>
                <br />
                <a href={listingOffice.website} target="_blank" rel="noopener noreferrer"> {/* Link to office's website. */}
                  Office Website
                </a>
              </>
            )}
          </p>
        )}
      </div>

      {/* Conditionally renders the price history chart if history data is available. */}
      {history && (
        <div style={sectionStyle}>
          <h4>Price History</h4>
          <PriceHistoryChart history={history} /> {/* Use the PriceHistoryChart component. */}
        </div>
      )}
    </div>
  );
};

// Expandable description component with read more/less toggle
const ExpandableDescription = ({ description }: { description: string }) => {
  // State to control whether the full description is expanded or collapsed.
  const [expanded, setExpanded] = useState(false);
  // Maximum number of characters to display in the collapsed view.
  const maxLength = 300;
  
  // Checks if the description is longer than the maximum length for collapsing.
  const isLongDescription = description.length > maxLength;
  // Determines the text to display based on the expanded state and description length.
  const displayText = !expanded && isLongDescription 
    ? description.substring(0, maxLength) + '...' // Show a truncated version with ellipsis.
    : description; // Show the full description if expanded or short enough.
  
  // Style object for the "Read more/less" button.
  const toggleButton = {
    color: '#007bff', // Blue color, typically used for links.
    background: 'none', // No background.
    border: 'none', // No border.
    padding: '0.5rem 0', // Padding above and below the text.
    cursor: 'pointer', // Show a pointer cursor on hover.
    fontWeight: 600 as const, // Make the text bold.
    textDecoration: 'underline', // Underline the text.
    display: 'block', // Make the button a block element.
    marginTop: '0.5rem', // Add some margin above the button.
  };

  // Renders the expandable description.
  return (
    <div>
      {/* Display the description text, replacing newlines with HTML line breaks for formatting. */}
      <div dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, '<br>') }} />
      {/* Conditionally render the "Read more/less" button if the description is long enough. */}
      {isLongDescription && (
        <button 
          onClick={() => setExpanded(!expanded)} // Toggle the expanded state on click.
          style={toggleButton} // Apply the button styling.
        >
          {expanded ? 'Read less' : 'Read more'} {/* Display "Read less" or "Read more" based on the expanded state. */}
        </button>
      )}
    </div>
  );
};

export default PropertyDetail;