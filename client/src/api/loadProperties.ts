import rawData from '../data/mergedProperties.json'
import { Property } from '../types/Property'

function normalize(value: number, min: number, max: number, inverse = false): number {
  if (value == null || isNaN(value)) return 0
  const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1)
  return inverse ? 1 - normalized : normalized
}

export function getEnrichedProperties(): Property[] {
  return (rawData as any[]).map((item): Property => {
    const price = Number(item.saleInfo?.price ?? item.rentInfo?.price)
    const rent = Number(item.rentInfo?.price)
    const daysOnMarket = item.saleInfo?.daysOnMarket ?? item.rentInfo?.daysOnMarket

    const rentalYield =
      price > 0 && rent > 0 ? +(rent * 12 / price * 100).toFixed(2) : undefined

    const investmentScore = rentalYield !== undefined && price > 0
      ? +(
          normalize(rentalYield, 0, 10) * 0.5 +
          normalize(price, 0, 2_000_000, true) * 0.25 +
          normalize(daysOnMarket ?? 365, 0, 365, true) * 0.25
        ).toFixed(2) * 10
      : undefined

    return {
      id: item.id,
      formattedAddress: item.formattedAddress,
      city: item.city || item.saleInfo?.city,
      state: item.state || item.saleInfo?.state,
      zipCode: item.zipCode || item.saleInfo?.zipCode,
      latitude: item.latitude || item.saleInfo?.latitude,
      longitude: item.longitude || item.saleInfo?.longitude,
      bedrooms: item.bedrooms || item.saleInfo?.bedrooms || 0,
      bathrooms: item.bathrooms || item.saleInfo?.bathrooms || 0,
      squareFootage: item.squareFootage || item.saleInfo?.squareFootage,
      lotSize: item.lotSize || item.saleInfo?.lotSize,
      yearBuilt: item.yearBuilt || item.saleInfo?.yearBuilt,
      price: item.saleInfo?.price ?? null,
      rent: item.rentInfo?.price ?? null,
      propertyType: item.propertyType || item.saleInfo?.propertyType,
      status: item.saleInfo?.status,
      listingAgent: item.saleInfo?.listingAgent,
      listingOffice: item.saleInfo?.listingOffice,
      saleInfo: item.saleInfo,
      rentInfo: item.rentInfo,
      history: item.saleInfo?.history,
      rentalYield,
      investmentScore,
      daysOnMarket
    }
  })
}
