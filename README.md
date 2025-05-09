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
We plan to evaluate the system in three ways:

1\. Quantitative evaluation using IR metrics: We will measure Precision@K, Mean Reciprocal Rank (MRR), and Normalized Discounted Cumulative Gain (NDCG) by comparing system rankings against manually labeled “high-return” properties in a subset of the dataset.

2\. Case study comparison: We will conduct case studies comparing our system’s top-ranked results for sample queries against publicly available listings and analyze alignment with known desirable properties.

3\. User feedback: We will gather informal feedback from potential users (classmates or early-stage investors) to assess usability, ranking interpretability, and feature utility.

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
