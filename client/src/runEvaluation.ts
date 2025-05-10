// src/runEvaluation.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { calculatePrecisionAtK, calculateMRR, calculateNDCGatK } from './utils/evaluation';
import { Property } from './types/Property';
import { getRankedProperties } from './utils/ranking';

// Define the Query type for our test queries
interface Query {
  query: string;
  relevantIds: string[];  // IDs of relevant properties for this query
  groundTruth?: any[];    // Optional ground truth data for NDCG calculation
  weights?: { [key: string]: number }; // Optional query-specific weights for ranking
}

// Get ranked results for a specific query
function getRankedResults(query: Query): Array<Property & { rankingScore: number }> {
  try {
    // Load all properties from your data file
    const allProperties = JSON.parse(readFileSync('./src/data/properties.json', 'utf-8')) as Property[];
    
    // Default weights if not provided in the query
    const defaultWeights = {
      school: 0.15,
      crimeRate: 0.15,
      hospital: 0.1,
      price: 0.15,
      size: 0.1,
      investmentScore: 0.15,
      rentalYield: 0.15,
      daysOnMarket: 0.05
    };
    
    // Use query-specific weights if available, otherwise use default weights
    const weights = query.weights || defaultWeights;
    
    // Use the existing ranking function from ranking.ts
    // This returns properties with rankingScore added
    const rankedProperties = getRankedProperties(allProperties, weights);
    
    // If there's a specific query term, we could further filter or adjust rankings
    // This would be where you might integrate with the BM25 search engine
    if (query.query && query.query.trim() !== '') {
      // This is where you could integrate with your BM25 engine for text search
      // For now, we'll just use the existing ranking
    }
    
    return rankedProperties;
  } catch (error) {
    console.error('Error retrieving ranked results:', error);
    return [];
  }
}

try {
  // Load test queries
  const testQueries = JSON.parse(readFileSync('./src/data/test_queries.json', 'utf-8'));
  const queries = testQueries as Query[];

  // Process each query and get ranked results
  const results = queries.map((query) => {
    const rankedProperties = getRankedResults(query);
    console.log(`Query: ${query.query}, Results: ${rankedProperties.length} properties`);
    
    // Calculate evaluation metrics
    if (query.relevantIds && query.relevantIds.length > 0) {
      const precisionAt5 = calculatePrecisionAtK(rankedProperties, query.relevantIds, 5);
      console.log(`  Precision@5: ${precisionAt5.toFixed(3)}`);
      
      const precisionAt10 = calculatePrecisionAtK(rankedProperties, query.relevantIds, 10);
      console.log(`  Precision@10: ${precisionAt10.toFixed(3)}`);
      
      // If we have ground truth for NDCG
      if (query.groundTruth) {
        const ndcgAt10 = calculateNDCGatK(rankedProperties, query.groundTruth, 10);
        console.log(`  NDCG@10: ${ndcgAt10.toFixed(3)}`);
      }
    }
    
    return {
      query: query.query,
      rankedProperties: rankedProperties.map((p) => ({
        id: p.id,
        rankingScore: p.rankingScore || 0,
        rentInfo: p.rentInfo,
        rentalYield: p.rentalYield,
        investmentScore: p.investmentScore,
      })),
    };
  });

  // Calculate MRR across all queries
  if (queries.length > 0 && queries[0].relevantIds) {
    // We need to cast rankedProperties to Property[] since the evaluation function expects this type
    const allRankedResults = results.map(r => r.rankedProperties as unknown as Property[]);
    const allRelevantIds = queries.map(q => q.relevantIds || []);
    const mrr = calculateMRR(allRankedResults, allRelevantIds);
    console.log(`\nOverall MRR: ${mrr.toFixed(3)}`);
  }

  // Ensure the data directory exists
  if (!existsSync('./data')) {
    console.log('Creating ./data directory');
    mkdirSync('./data');
  }

  console.log('Writing results to ./data/ranked_results.json');
  writeFileSync(
    './data/ranked_results.json',
    JSON.stringify(results, null, 2),
    'utf-8'
  );

  console.log('Ranked results saved to ./data/ranked_results.json');
} catch (error) {
  console.error('Error running evaluation:', error);
}