// src/utils/ranking.ts
import crimeDataRaw from '../data/crimeData.json';
import hospitalDataRaw from '../data/hospitalData.json';
import schoolDataRaw from '../data/schoolData.json';
import { Property } from '../types/Shared';

// --- Helper Functions ---
function normalize(value: number, min: number, max: number, inverse = false): number {
  if (value == null || isNaN(value)) return 0;
  if (min === max) return inverse ? 0 : 1;
  const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1);
  return inverse ? 1 - normalized : normalized;
}

function gradeToScore(grade?: string): number {
  if (!grade) return 0;
  const gradeMap: { [key: string]: number } = { A: 1, B: 2, C: 3, D: 4, F: 5 };
  return gradeMap[grade.toUpperCase()] || 0;
}

// --- Data Processing Types ---
interface CrimeDataItem {
  Zipcode: number;
  'Property Crime Grade': string;
  'Total Property Crime': number;
  'Violent Crime Grade': string;
  'Total Violent Crime': number;
}

interface HospitalDataItem {
  Zipcode: number;
  HospitalCount: number;
}

interface SchoolDataItem {
  Zipcode: number;
  SchoolCount: number;
}

// --- Data Processing ---
const crimeDataByZipcode: { [zipcode: number]: CrimeDataItem } = (crimeDataRaw as CrimeDataItem[]).reduce((acc, item) => {
  acc[item.Zipcode] = item;
  return acc;
}, {} as { [zipcode: number]: CrimeDataItem });

const hospitalDataByZipcode: { [zipcode: number]: { hospitalCount: number } } = (hospitalDataRaw as HospitalDataItem[]).reduce((acc, item) => {
  acc[item.Zipcode] = { hospitalCount: item.HospitalCount };
  return acc;
}, {} as { [zipcode: number]: { hospitalCount: number } });

const schoolDataByZipcode: { [zipcode: number]: { schoolCount: number } } = (schoolDataRaw as SchoolDataItem[]).reduce((acc, item) => {
  acc[item.Zipcode] = { schoolCount: item.SchoolCount };
  return acc;
}, {} as { [zipcode: number]: { schoolCount: number } });

// --- Ranking Function ---
export function getRankedProperties(properties: Property[], weights: { [key: string]: number }): (Property & { rankingScore: number })[] {
  return properties.map(property => {
    const zipcode = Number(property.zipCode);
    
    const crimeInfo = crimeDataByZipcode[zipcode];
    const hospitalInfo = hospitalDataByZipcode[zipcode];
    const schoolInfo = schoolDataByZipcode[zipcode];

    let rankingScore = 0;
    const scores: { [key: string]: number } = {};

    // School Score
    scores.school = normalize(schoolInfo?.schoolCount ?? 0, 0, 15);

    // Crime Rate Score
    const propertyCrimeScore = crimeInfo ? gradeToScore(crimeInfo['Property Crime Grade']) : 0;
    const violentCrimeScore = crimeInfo ? gradeToScore(crimeInfo['Violent Crime Grade']) : 0;
    const totalPropertyCrime = crimeInfo ? crimeInfo['Total Property Crime'] : 0;
    const totalViolentCrime = crimeInfo ? crimeInfo['Total Violent Crime'] : 0;

    scores.crimeRate = normalize(
      (gradeToScore('A') - propertyCrimeScore) + (gradeToScore('A') - violentCrimeScore) +
      normalize(totalPropertyCrime, 0, 500, true) + normalize(totalViolentCrime, 0, 100, true),
      0,
      (gradeToScore('F') - gradeToScore('A')) * 2 + 2
    );

    // Hospital Access Score
    scores.hospital = normalize(hospitalInfo?.hospitalCount ?? 0, 0, 5);

    // Price Score
    scores.price = normalize(Number(property.price) || 1_000_000, 0, 2_000_000, true);

    // Size Score
    scores.size = normalize(property.squareFootage ?? 0, 0, 3000);

    // Investment Score
    scores.investmentScore = normalize(property.investmentScore ?? 0, 0, 10);

    // Rental Yield
    scores.rentalYield = normalize(property.rentalYield ?? 0, 0, 10);

    // Days on Market
    scores.daysOnMarket = normalize(property.daysOnMarket ?? 365, 0, 365, true);

    // Calculate Weighted Score
    for (const key in weights) {
      if (scores.hasOwnProperty(key) && weights.hasOwnProperty(key)) {
        rankingScore += scores[key] * weights[key];
      }
    }

    return { ...property, rankingScore };
  }).sort((a, b) => b.rankingScore - a.rankingScore);
}