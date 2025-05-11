# **Information Retrieval System for Real Estate Investment Analysis**

**Track** 			Development Track  
**Team Members** 	Jason Hu \[[jasonh11@illinois.edu](mailto:jasonh11@illinois.edu)\], Nianze Guo \[[nianzeg2@illinois.edu](mailto:nianzeg2@illinois.edu)\],   
Chenhan Luo \[[chenhan8@illinois.edu](mailto:chenhan8@illinois.edu)\], Haoran Tang \[[ht18@illinois.edu](mailto:ht18@illinois.edu)\]   
**Project Coordinator**		Jason Hu

**Functions and Users**  
We developed a real estate-focused information retrieval (IR) system with a web-based interface to help investors search for and rank properties based on investment potential. The system functions as a browser-based search engine that enables users to search for properties using filters such as price, rental yield, property size, and neighborhood metrics (e.g., crime rates, school counts, hospital access). Our tool provides real estate investors, financial analysts, and homebuyers looking for high-return properties with ranked search results based on customized investment-relevant criteria.

The system allows users to filter and sort properties not only by basic attributes like price and square footage but also by financial and neighborhood factors that impact investment value. By combining multiple publicly available datasets (e.g., crime statistics, school counts, hospital counts) into a unified ranking score, the tool helps users prioritize properties that meet their personalized investment goals.

**Significance**  
Most real estate platforms like Zillow and Redfin primarily sort properties by price or location without providing meaningful investment analysis. Investors seeking properties with optimal rental yields, low crime rates, good school districts, and access to hospitals face information overload and lack integrated tools that consolidate these diverse factors into a single view.

Our system addresses this gap by offering a search engine with an investment-centric ranking model that integrates crime, school, and hospital data alongside traditional property attributes. This tool saves time by automatically prioritizing properties with stronger investment signals, reducing the need for manual research across disparate sources, and enabling more data-driven decision-making.

**Approach**  
We built the system as a web-based application using React (frontend) and preprocessed static datasets for properties, crime rates, school counts, and hospital access. The core innovation lies in a custom ranking function that calculates a weighted score for each property based on multiple factors, including:  
Neighborhood crime (both violent and property crime grades)  
Local school count  
Nearby hospital count  
Property price  
Property size (square footage)  
Rental yield  
Days on market

We implemented a BM25-based search engine (using wink-nlp and wink-bm25-text-search) to enable keyword searches over property descriptions and addresses. Users can apply filters (e.g., min price, min rental yield, min beds) and adjust ranking parameters through an interactive UI.

Originally, we planned to integrate a backend with FastAPI, PostgreSQL, and Elasticsearch. Due to timeline and scope adjustments, we transitioned to a fully client-side application using static JSON data and lightweight NLP/search libraries in the frontend. While the original design included Learning-to-Rank (LTR) models, we prioritized a custom weighted ranking approach for this iteration.

**Evaluation**  
We plan to evaluate the system:

Quantitative evaluation using IR metrics: We will measure Precision@K, Mean Reciprocal Rank (MRR), and Normalized Discounted Cumulative Gain (NDCG) by comparing system rankings against manually labeled “high-return” properties in a subset of the dataset.

**Timeline**  
Milestone	Completion Date  
Data integration and preprocessing		Completed  
Search indexing and retrieval (BM25)		Completed  
Custom ranking model implementation		Completed  
UI/UX development and system integration	Completed  
Evaluation and documentation			May 9, 2025

**Task Division**  
Jason Hu		Frontend, search interface, filters, data collection and preprocessing  
Nianze Guo	Ranking algorithm development, evaluation metrics implementation  
Chenhan Luo	Dataset integration, evaluation metrics implementation  
Haoran Tang	Ranking algorithm development, BM25 integration  

# Information Retrieval System Installation & Usage Guide

## Source Code Repository

The system’s source code is hosted in a public GitHub repository at:

[https://github.com/thu1012/CS510-Team10](https://github.com/thu1012/CS510-Team10)

## Installation Instructions

### 1. Clone the repository:

```bash
git clone https://github.com/thu1012/CS510-Team10
```

### 2. Install required dependencies:

The project requires the following npm packages:

| Package                 | Purpose                        |
| ----------------------- | ------------------------------ |
| react                   | Core UI framework              |
| react-dom               | React DOM rendering            |
| react-router-dom        | Routing/navigation             |
| recharts                | Price history charting         |
| wink-nlp                | Natural language processing    |
| wink-eng-lite-web-model | English NLP model for wink-nlp |
| wink-bm25-text-search   | BM25 text search engine        |

Install dependencies with:

```bash
npm install react react-dom react-router-dom recharts wink-nlp wink-eng-lite-web-model wink-bm25-text-search typescript
```

### 3. Start the development server:

```bash
npm start
```

This will open the app at [http://localhost:3000](http://localhost:3000) in your default browser.

## Configuration

### Ranking Weights

Key system parameters are configured directly in code (no external config files required). The metric weights used for ranking properties are defined in `src/pages/Home.tsx` under the `rankingWeights` object:

```typescript
const rankingWeights = {
  school: 0.15,
  crimeRate: 0.25,
  hospital: 0.10,
  price: 0.15,
  size: 0.35,
  investmentScore: 0.0,
  rentalYield: 0.0,
  daysOnMarket: 0.0,
};
```

To adjust ranking priorities, modify these values and rebuild/restart the app.

### Static Data Files

* `src/data/properties_full.json`
* `src/data/crimeData.json`
* `src/data/schoolData.json`
* `src/data/hospitalData.json`
* `src/data/description.json`

To update datasets, replace these JSON files with updated versions using the same schema.

## Usage Instructions

Once the app is running, users interact through two main pages:

### Search Page (`/`)

* Use the search bar to enter free-text queries (matches property address or description).
* Use the filter sidebar to set numeric or categorical filters:

  * Min/Max Price
  * Min Rental Yield
  * Min Bedrooms / Bathrooms
  * Min Square Footage
  * Min Investment Score
  * Min/Max Days on Market
  * Property Type
* Enable or disable filters using the toggle checkboxes beside each filter.
* Select sorting criteria from the dropdown (price ascending/descending, rental yield, investment score, ranking score, text relevance).
* View filtered results in a two-column grid of property cards.

Each property card displays:

* Address
* Property Type
* Bedrooms / Bathrooms
* Price
* Rental Yield
* Investment Score
* Ranking Score

Click a property card to open the detail page.

### Property Detail Page (`/property/:id`)

* Shows full property address and type.
* Displays all available attributes:

  * Price, Rent, Yield, Investment Score, Ranking Score
  * Square Footage, Lot Size, Year Built, ZIP code, State
* Shows listing agent and office contact details (if available).
* Renders a price history chart (if historical price data exists).
* Shows full property description with a “Read more”/“Read less” toggle.
* Includes a “Back to Search” link that preserves prior filter/search settings.

## Example Usage Scenarios

### Example 1: Find affordable properties with high rental yield

1. Set Max Price to \$300,000 (enable toggle).
2. Set Min Rental Yield to 6% (enable toggle).
3. Select sort by Rental Yield.

### Example 2: Find properties in low-crime areas near schools

1. Set Min School Count to 5 (enable toggle).
2. Disable Min Price toggle.
3. Select sort by Ranking Score.

### Example 3: Search properties by keyword

1. Enter `Belleville` in the search bar.
2. Select sort by Text Relevance.
