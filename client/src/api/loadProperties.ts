// src/api/loadProperties.ts

import rawData from '../data/properties_full.json'
import { Property } from '../types/Property'

// Normalize a value to a range between 0 and 1 (or its inverse)
function normalize(value: number, min: number, max: number, inverse = false): number {
  // Return 0 if value is null or NaN
  if (value == null || isNaN(value)) return 0
  // Calculate normalized value between 0 and 1
  const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1)
  return inverse ? 1 - normalized : normalized
}

// Function to enrich raw property data with additional calculated values
export function getEnrichedProperties(): Property[] {
  return (rawData as any[]).map((item): Property => {
    // Extract sale and rent information, defaulting to empty objects
    const sale = item.saleInfo ?? {}
    const rent = item.rentInfo ?? {}

    // Extract prices and days on market
    const price = Number(sale.price)
    const rentPrice = Number(rent.price)
    const daysOnMarket = sale.daysOnMarket ?? rent.daysOnMarket

    // Calculate rental yield (if price and rent are available)
    const rentalYield =
      price > 0 && rentPrice > 0 ? +(rentPrice * 12 / price * 100).toFixed(2) : undefined

    // Calculate investment score based on rental yield, price, and days on market
    const investmentScore = rentalYield !== undefined && price > 0
      ? +(
          normalize(rentalYield, 0, 10) * 0.5 + 
          normalize(price, 0, 2_000_000, true) * 0.25 + 
          normalize(daysOnMarket ?? 365, 0, 365, true) * 0.25 
        ).toFixed(2) * 10
      : undefined

    // Return enriched property object with additional calculated fields
    return {
      id: item.id,
      formattedAddress: item.formattedAddress,
      city: item.city || sale.city || rent.city,
      state: item.state || sale.state || rent.state,
      zipCode: item.zipCode || sale.zipCode || rent.zipCode,
      latitude: item.latitude || sale.latitude || rent.latitude,
      longitude: item.longitude || sale.longitude || rent.longitude,
      bedrooms: item.bedrooms || sale.bedrooms || rent.bedrooms || 0,
      bathrooms: item.bathrooms || sale.bathrooms || rent.bathrooms || 0,
      squareFootage: item.squareFootage || sale.squareFootage || rent.squareFootage,
      lotSize: item.lotSize || sale.lotSize,
      yearBuilt: item.yearBuilt || sale.yearBuilt,
      price: sale.price ?? null,
      rent: rent.price ?? null,
      propertyType: item.propertyType || sale.propertyType || rent.propertyType,
      status: sale.status || rent.status,
      listingAgent: sale.listingAgent || rent.listingAgent,
      listingOffice: sale.listingOffice || rent.listingOffice,
      saleInfo: sale,
      rentInfo: rent,
      history: sale.history || rent.history,
      rentalYield, 
      investmentScore, 
      daysOnMarket, 
      description: item.description
    }
  })
}
