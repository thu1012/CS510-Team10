import mergedProperties from '../data/mergedProperties.json'
import { Property } from '../types/Property'

export const getEnrichedProperties = (): Property[] => {
  return mergedProperties.map((p: any) => ({
    id: p.id,
    formattedAddress: p.formattedAddress,
    city: p.city,
    state: p.state,
    zipCode: p.zipCode,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    squareFootage: p.squareFootage,
    propertyType: p.propertyType,
    price: p.saleInfo?.price ?? p.price ?? 0,
    rentalYield: p.rentInfo && p.saleInfo ? +(((p.rentInfo.price * 12) / p.saleInfo.price) * 100).toFixed(2) : undefined,
    investmentScore: p.rentInfo && p.saleInfo ? +(((p.rentInfo.price * 12) / p.saleInfo.price) * 1000).toFixed(2) : undefined,
    ownerOccupied: p.ownerOccupied ?? false,
    // Add any additional fields you want
    saleInfo: p.saleInfo,
    rentInfo: p.rentInfo,
  }))
}
