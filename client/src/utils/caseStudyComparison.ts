import { readFileSync, writeFileSync } from 'fs';
import { Property, CaseStudy, ComparisonResult } from '../types/Shared';
import { getRankedProperties } from './ranking';

export function runCaseStudies(
  caseStudiesPath: string,
  propertiesPath: string,
  outputPath: string
): ComparisonResult[] {
  try {
    const caseStudies = JSON.parse(readFileSync(caseStudiesPath, 'utf-8')) as CaseStudy[];
    const allProperties = JSON.parse(readFileSync(propertiesPath, 'utf-8')) as Property[];
    
    console.log(`Loaded ${caseStudies.length} case studies and ${allProperties.length} properties`);
    
    const results: ComparisonResult[] = caseStudies.map(caseStudy => {
      console.log(`\nRunning case study: "${caseStudy.name}"`);
      
      const locationProperties = caseStudy.location ? 
        allProperties.filter(prop => 
          (prop.city && prop.city.toLowerCase().includes(caseStudy.location.toLowerCase())) ||
          (prop.state && prop.state.toLowerCase().includes(caseStudy.location.toLowerCase())) ||
          (prop.zipCode && prop.zipCode.includes(caseStudy.location))
        ) : 
        allProperties;
      
      console.log(`  Location filtered to ${locationProperties.length} properties`);
      
      const rankedProperties = getRankedProperties(locationProperties, caseStudy.weights);
      const benchmarkIds = caseStudy.benchmarkProperties.map(bp => bp.id);
      const benchmarkRanks: number[] = [];
      
      benchmarkIds.forEach(id => {
        const rank = rankedProperties.findIndex(prop => prop.id === id);
        if (rank >= 0) benchmarkRanks.push(rank + 1);
      });
      
      const benchmarkInTop5 = benchmarkRanks.filter(rank => rank <= 5).length;
      const benchmarkInTop10 = benchmarkRanks.filter(rank => rank <= 10).length;
      const sortedRanks = [...benchmarkRanks].sort((a, b) => a - b);
      const medianRank = sortedRanks.length > 0 ? 
        sortedRanks.length % 2 === 0 ?
          (sortedRanks[sortedRanks.length/2 - 1] + sortedRanks[sortedRanks.length/2])/2 :
          sortedRanks[Math.floor(sortedRanks.length/2)] : 0;

      const benchmarkScores = rankedProperties
        .filter(prop => benchmarkIds.includes(prop.id))
        .map(prop => prop.rankingScore);
      
      const nonBenchmarkScores = rankedProperties
        .filter(prop => !benchmarkIds.includes(prop.id))
        .map(prop => prop.rankingScore);

      const benchmarkAverageScore = benchmarkScores.length > 0 ?
        benchmarkScores.reduce((sum, score) => sum + score, 0)/benchmarkScores.length : 0;
      
      const nonBenchmarkAverageScore = nonBenchmarkScores.length > 0 ?
        nonBenchmarkScores.reduce((sum, score) => sum + score, 0)/nonBenchmarkScores.length : 0;

      const analysisNotes: string[] = [];
      if (benchmarkInTop10 === 0) {
        analysisNotes.push("⚠️ No benchmark properties found in top 10 results");
      } else if (benchmarkInTop5 > 0) {
        analysisNotes.push(`✅ ${benchmarkInTop5} benchmark properties found in top 5 results`);
      }
      
      if (benchmarkAverageScore > nonBenchmarkAverageScore) {
        analysisNotes.push("✅ Benchmark properties score higher on average than non-benchmark properties");
      } else {
        analysisNotes.push("⚠️ Benchmark properties score lower on average than non-benchmark properties");
      }
      
      if (medianRank > 0 && medianRank <= 20) {
        analysisNotes.push(`✅ Median rank of benchmark properties is ${medianRank}`);
      } else if (medianRank > 20) {
        analysisNotes.push(`⚠️ Median rank of benchmark properties is ${medianRank} (> 20)`);
      }

      return {
        caseStudy,
        systemResults: rankedProperties.slice(0, 10),
        benchmarkComparison: {
          benchmarkInTop5,
          benchmarkInTop10,
          benchmarkMedianRank: medianRank,
          benchmarkAverageScore,
          nonBenchmarkAverageScore
        },
        analysisNotes
      };
    });
    
    writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
    return results;
  } catch (error) {
    console.error('Error running case studies:', error);
    return [];
  }
}

// Function to generate HTML report from results
export function generateHtmlReport(results: ComparisonResult[], outputPath: string) {
  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Property Ranking Case Study Comparison</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
        h1, h2, h3 { color: #2c3e50; }
        .case-study { background: #f9f9f9; border-radius: 5px; padding: 20px; margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .metrics { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
        .metric { background: #fff; border-radius: 5px; padding: 15px; flex: 1; min-width: 200px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .metric h4 { margin-top: 0; color: #7f8c8d; }
        .metric .value { font-size: 24px; font-weight: bold; color: #2980b9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        tr:hover { background-color: #f5f5f5; }
        .benchmark { background-color: #e8f4f8; }
        .notes { background: #fff8dc; padding: 15px; border-left: 4px solid #f1c40f; margin: 20px 0; }
        .note { margin: 5px 0; }
        .good { color: #27ae60; }
        .warning { color: #e67e22; }
        .error { color: #e74c3c; }
      </style>
    </head>
    <body>
      <h1>Property Ranking System: Case Study Comparison</h1>
      <p>This report compares our property ranking system against known desirable properties across various case studies.</p>
      
      ${results.map(result => `
        <div class="case-study">
          <h2>${result.caseStudy.name}</h2>
          <p><strong>Query:</strong> ${result.caseStudy.query}</p>
          <p><strong>Location:</strong> ${result.caseStudy.location}</p>
          
          <h3>Metrics</h3>
          <div class="metrics">
            <div class="metric">
              <h4>Benchmark in Top 5</h4>
              <div class="value">${result.benchmarkComparison.benchmarkInTop5}/${result.caseStudy.benchmarkProperties.length}</div>
            </div>
            <div class="metric">
              <h4>Benchmark in Top 10</h4>
              <div class="value">${result.benchmarkComparison.benchmarkInTop10}/${result.caseStudy.benchmarkProperties.length}</div>
            </div>
            <div class="metric">
              <h4>Median Rank</h4>
              <div class="value">${result.benchmarkComparison.benchmarkMedianRank.toFixed(1)}</div>
            </div>
            <div class="metric">
              <h4>Avg Score (Benchmark)</h4>
              <div class="value">${result.benchmarkComparison.benchmarkAverageScore.toFixed(3)}</div>
            </div>
            <div class="metric">
              <h4>Avg Score (Others)</h4>
              <div class="value">${result.benchmarkComparison.nonBenchmarkAverageScore.toFixed(3)}</div>
            </div>
          </div>
          
          <h3>Analysis Notes</h3>
          <div class="notes">
            ${result.analysisNotes.map(note => `
              <div class="note ${note.startsWith('✅') ? 'good' : note.startsWith('⚠️') ? 'warning' : ''}">
                ${note}
              </div>
            `).join('')}
          </div>
          
          <h3>Top 10 Results</h3>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Property ID</th>
                <th>Score</th>
                <th>Price</th>
                <th>Rental Yield</th>
                <th>Investment Score</th>
                <th>Benchmark</th>
              </tr>
            </thead>
            <tbody>
              ${result.systemResults.map((prop, index) => {
                const isBenchmark = result.caseStudy.benchmarkProperties.some(bp => bp.id === prop.id);
                const benchmarkInfo = isBenchmark ? 
                  result.caseStudy.benchmarkProperties.find(bp => bp.id === prop.id) : null;
                
                return `
                  <tr class="${isBenchmark ? 'benchmark' : ''}">
                    <td>${index + 1}</td>
                    <td>${prop.id}</td>
                    <td>${prop.rankingScore.toFixed(3)}</td>
                    <td>${prop.price ? '$'+prop.price.toLocaleString() : 'N/A'}</td>
                    <td>${prop.rentalYield ? (prop.rentalYield * 100).toFixed(1) + '%' : 'N/A'}</td>
                    <td>${prop.investmentScore ? prop.investmentScore.toFixed(1) : 'N/A'}</td>
                    <td>${isBenchmark ? `✅ ${benchmarkInfo?.desirabilityReason || 'Yes'}` : ''}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <h3>Benchmark Properties</h3>
          <table>
            <thead>
              <tr>
                <th>Property ID</th>
                <th>Reason for Desirability</th>
                <th>Source</th>
                <th>System Rank</th>
              </tr>
            </thead>
            <tbody>
              ${result.caseStudy.benchmarkProperties.map(bp => {
                const systemRank = result.systemResults.findIndex(prop => prop.id === bp.id) + 1;
                const foundInSystem = systemRank > 0;
                
                return `
                  <tr>
                    <td>${bp.id}</td>
                    <td>${bp.desirabilityReason}</td>
                    <td>${bp.source || 'N/A'}</td>
                    <td>${foundInSystem ? systemRank : 'Not in top 10'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          ${result.caseStudy.publicListings ? `
            <h3>Comparable Public Listings</h3>
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Rank</th>
                  <th>Key Features</th>
                </tr>
              </thead>
              <tbody>
                ${result.caseStudy.publicListings.map(listing => `
                  <tr>
                    <td>${listing.platform}</td>
                    <td>${listing.rank}</td>
                    <td>${listing.key_features.join(', ')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
        </div>
      `).join('')}
    </body>
    </html>
    `;
    
    writeFileSync(outputPath, htmlContent, 'utf-8');
    console.log(`HTML report generated at ${outputPath}`);
  } catch (error) {
    console.error('Error generating HTML report:', error);
  }
}

// Example usage
/*
if (require.main === module) {
  const results = runCaseStudies(
    './src/data/case_studies.json',
    './src/data/properties.json',
    './data/case_study_results.json'
  );
  
  if (results.length > 0) {
    generateHtmlReport(results, './data/case_study_report.html');
  }
}
*/