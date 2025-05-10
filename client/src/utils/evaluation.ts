// src/utils/evaluation.ts

import { Property } from '../types/Property';

/**
 * Calculates Precision@K for a single query.
 * @param rankedResults - The ranked list of properties returned by the search engine.
 * @param relevantIds - An array of property IDs that are considered "high-return" for this query.
 * @param k - The number of top results to consider.
 * @returns The Precision@K score.
 */
export function calculatePrecisionAtK(
    rankedResults: Property[],
    relevantIds: string[],
    k: number
): number {
    const topK = rankedResults.slice(0, k);
    let relevantCount = 0;
    for (const result of topK) {
        if (relevantIds.includes(result.id)) {
            relevantCount++;
        }
    }
    return relevantCount / k;
}

/**
 * Calculates Mean Reciprocal Rank (MRR) over a set of queries.
 * @param allRankedResults - An array of ranked result lists (one list per query).
 * @param allRelevantIds - An array of arrays of relevant property IDs (one array per query).
 * @returns The MRR score.
 */
export function calculateMRR(
    allRankedResults: Property[][],
    allRelevantIds: string[][]
): number {
    let totalReciprocalRank = 0;
    let numQueries = allRankedResults.length;

    for (let i = 0; i < numQueries; i++) {
        const rankedResults = allRankedResults[i];
        const relevantIds = allRelevantIds[i];
        let foundRelevant = false;

        for (let j = 0; j < rankedResults.length; j++) {
            if (relevantIds.includes(rankedResults[j].id)) {
                totalReciprocalRank += 1 / (j + 1); // Rank starts from 1
                foundRelevant = true;
                break; // Stop after the first relevant result
            }
        }
        if (!foundRelevant) {
            totalReciprocalRank += 0; // If no relevant result, reciprocal rank is 0
        }
    }

    return numQueries > 0 ? totalReciprocalRank / numQueries : 0;
}

/**
 * Calculates Normalized Discounted Cumulative Gain (NDCG) at K for a single query.
 * @param rankedResults - The ranked list of properties.
 * @param groundTruth - The ground truth data with relevance scores.
 * @param k - The number of top results to consider.
 * @returns The NDCG@K score.
 */
export function calculateNDCGatK(
    rankedResults: Property[],
    groundTruth: any[],
    k: number
): number {
    const dcg = calculateDCG(rankedResults, groundTruth, k);
    const idcg = calculateIDCG(groundTruth, k);
    return idcg === 0 ? 0 : dcg / idcg;
}

/**
 * Helper function to calculate Discounted Cumulative Gain (DCG).
 */
function calculateDCG(
    rankedResults: Property[],
    groundTruth: any[],
    k: number
): number {
    let dcg = 0;
    for (let i = 0; i < Math.min(rankedResults.length, k); i++) {
        const result = rankedResults[i];
        const truth = groundTruth.find(gt => gt.id === result.id);
        const relevance = truth ? truth.relevance : 0; // Get relevance from ground truth
        dcg += relevance / Math.log2(i + 2); // i starts from 0, position starts from 1
    }
    return dcg;
}

/**
 * Helper function to calculate Ideal Discounted Cumulative Gain (IDCG).
 */
function calculateIDCG(groundTruth: any[], k: number): number {
    // Sort ground truth by relevance in descending order
    const sortedTruth = [...groundTruth].sort((a, b) => b.relevance - a.relevance);
    let idcg = 0;
    for (let i = 0; i < Math.min(sortedTruth.length, k); i++) {
        idcg += sortedTruth[i].relevance / Math.log2(i + 2);
    }
    return idcg;
}