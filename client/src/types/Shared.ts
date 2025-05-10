import { Property } from './Property';

// src/types/shared.ts


export interface CaseStudy {
  name: string;
  query: string;
  location: string;
  weights: { [key: string]: number };
  benchmarkProperties: {
    id: string;
    desirabilityReason: string;
    source?: string;
  }[];
  publicListings?: {
    platform: string;
    url: string;
    rank: number;
    key_features: string[];
  }[];
}

export interface ComparisonResult {
  caseStudy: CaseStudy;
  systemResults: Array<Property & { rankingScore: number }>;
  benchmarkComparison: {
    benchmarkInTop5: number;
    benchmarkInTop10: number;
    benchmarkMedianRank: number;
    benchmarkAverageScore: number;
    nonBenchmarkAverageScore: number;
  };
  analysisNotes: string[];
}
export type { Property } from './Property';  // Moved to top
