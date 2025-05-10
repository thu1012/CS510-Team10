import { runCaseStudies, generateHtmlReport } from './utils/caseStudyComparison';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('./data')) {
  console.log('Creating ./data directory');
  mkdirSync('./data');
}

const results = runCaseStudies(
  './src/data/case_studies.json',
  './src/data/properties.json',
  './data/case_study_results.json'
);

if (results.length > 0) {
  generateHtmlReport(results, './data/case_study_report.html');
  console.log('\nCase study evaluation complete!');
  console.log('Summary of findings:');
  
  results.forEach(result => {
    console.log(`\n${result.caseStudy.name}:`);
    result.analysisNotes.forEach(note => console.log(`  ${note}`));
  });
  
  console.log('\nView the full HTML report at ./data/case_study_report.html');
} else {
  console.log('No case study results were generated.');
}