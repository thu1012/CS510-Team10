import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { getEnrichedProperties } from '../api/loadProperties';
import { Property } from '../types/Property';
import { getRankedProperties } from '../utils/ranking'; // Import the ranking function
import { buildBm25Engine } from '../utils/bm25Engine';
import descriptions from '../data/description.json'; 

const Home = () => {
  const [sortBy, setSortBy] = useState<
    'priceDesc' | 'priceAsc' | 'rentDesc' | 'rentAsc' | 'rentalYield' | 'investmentScore' | 'rankingScore' | 'textRelevance' 
  >('rankingScore'); // Default sort by ranking score
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRent, setMinRent] = useState(0);
  const [minYield, setMinYield] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const [minSqft, setMinSqft] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [minDaysOnMarket, setMinDaysOnMarket] = useState(0);
  const [maxDaysOnMarket, setMaxDaysOnMarket] = useState(365);
  const [searchQuery, setSearchQuery] = useState('');

  const [enableMinPrice, setEnableMinPrice] = useState(true);
  const [enableMaxPrice, setEnableMaxPrice] = useState(true);
  const [enableMinRent, setEnableMinRent] = useState(false);
  const [enableMinYield, setEnableMinYield] = useState(false);
  const [enableMinBeds, setEnableMinBeds] = useState(false);
  const [enableMinBaths, setEnableMinBaths] = useState(false);
  const [enableMinSqft, setEnableMinSqft] = useState(false);
  const [enableMinScore, setEnableMinScore] = useState(false);
  const [enableMinDays, setEnableMinDays] = useState(false);
  const [enableMaxDays, setEnableMaxDays] = useState(false);

  const [hydrated, setHydrated] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rankedProperties, setRankedProperties] = useState<
    (Property & { rankingScore: number })[]
  >([]);

  const [bm25Scores, setBm25Scores] = useState<Record<number, number>>({});

  // Define your weights for the ranking
  const rankingWeights = {
    school: 0.15,
    crimeRate: 0.25,
    hospital: 0.10,
    price: 0.15, // Adjusted weight
    size: 0.35,  // Adjusted weight
    investmentScore: 0.0, // Optional: Include if you still want to weigh it
    rentalYield: 0.0,     // Optional: Include if you still want to weigh it
    daysOnMarket: 0.0,    // Optional: Include if you still want to weigh it
  };

  useEffect(() => {
    const getParam = (key: string, fallback: number) =>
      parseFloat(searchParams.get(key) || '') || fallback;

    const getBoolParam = (key: string, fallback = true) =>
      searchParams.get(key) === 'false' ? false : fallback;

    const isFirstVisit = searchParams.size === 0;

    setMinPrice(getParam('minPrice', 1));
    setMaxPrice(getParam('maxPrice', 1000000));
    setMinRent(getParam('minRent', 0));
    setMinYield(getParam('minYield', 0));
    setMinBeds(getParam('minBeds', 0));
    setMinBaths(getParam('minBaths', 0));
    setMinSqft(getParam('minSqft', 0));
    setMinScore(getParam('minScore', 0));
    setMinDaysOnMarket(getParam('minDaysOnMarket', 0));
    setMaxDaysOnMarket(getParam('maxDaysOnMarket', 365));
    setSortBy((searchParams.get('sortBy') as any) || 'rankingScore'); // Ensure sortBy is updated from params
    setPropertyType(searchParams.get('propertyType') || '');
    setSearchQuery(searchParams.get('q') || '');

    setEnableMinPrice(getBoolParam('enableMinPrice', true));
    setEnableMaxPrice(getBoolParam('enableMaxPrice', true));
    setEnableMinRent(getBoolParam('enableMinRent', !isFirstVisit));
    setEnableMinYield(getBoolParam('enableMinYield', !isFirstVisit));
    setEnableMinBeds(getBoolParam('enableMinBeds', !isFirstVisit));
    setEnableMinBaths(getBoolParam('enableMinBaths', !isFirstVisit));
    setEnableMinSqft(getBoolParam('enableMinSqft', !isFirstVisit));
    setEnableMinScore(getBoolParam('enableMinScore', !isFirstVisit));
    setEnableMinDays(getBoolParam('enableMinDays', !isFirstVisit));
    setEnableMaxDays(getBoolParam('enableMaxDays', !isFirstVisit));

    setHydrated(true);
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated) return;

    setSearchParams({
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
      minRent: minRent.toString(),
      minYield: minYield.toString(),
      minBeds: minBeds.toString(),
      minBaths: minBaths.toString(),
      minSqft: minSqft.toString(),
      minScore: minScore.toString(),
      minDaysOnMarket: minDaysOnMarket.toString(),
      maxDaysOnMarket: maxDaysOnMarket.toString(),
      sortBy,
      propertyType,
      q: searchQuery,

      enableMinPrice: enableMinPrice.toString(),
      enableMaxPrice: enableMaxPrice.toString(),
      enableMinRent: enableMinRent.toString(),
      enableMinYield: enableMinYield.toString(),
      enableMinBeds: enableMinBeds.toString(),
      enableMinBaths: enableMinBaths.toString(),
      enableMinSqft: enableMinSqft.toString(),
      enableMinScore: enableMinScore.toString(),
      enableMinDays: enableMinDays.toString(),
      enableMaxDays: enableMaxDays.toString(),
    });
  }, [
    hydrated,
    minPrice, maxPrice, minRent, minYield,
    minBeds, minBaths, minSqft, minScore,
    minDaysOnMarket, maxDaysOnMarket,
    sortBy, propertyType, searchQuery,
    enableMinPrice, enableMaxPrice, enableMinRent,
    enableMinYield, enableMinBeds, enableMinBaths,
    enableMinSqft, enableMinScore, enableMinDays, enableMaxDays
  ]);

  const allProperties = useMemo<Property[]>(() => {
    return getEnrichedProperties();
  }, []);

  useEffect(() => {
    const ranked = getRankedProperties(allProperties, rankingWeights);
    setRankedProperties(ranked);
  }, [allProperties, rankingWeights]); // Re-rank when properties or weights change

  const bm25 = useMemo(() => {
    return buildBm25Engine(
      (descriptions as Array<{ address: string; description: string }>)
    );
  }, [descriptions]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }
    // engine.search returns [ [docId, score], … ]
    const hits = bm25.search(
      searchQuery,
      allProperties.length
    ) as Array<[number, number]>;             // ← cast for TS
    const map: Record<number, number> = {};
    hits.forEach(([id, score]) => { map[id] = score; });
    setBm25Scores(map);
  }, [searchQuery, bm25]);

  // console.log('BM25 Scores:', bm25Scores);
  const query = searchQuery.toLowerCase();

  const filteredAndMaybeRanked = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const hasQuery = q.length > 0;

    return rankedProperties
      // 1) carry index so we can look up bm25Scores without findIndex
      .map((p, idx) => ({ p, idx }))
      // 2) filter based on sort mode, BM25 scores, and numeric/text filters
      .filter(({ p, idx }) => {
        // a) if user picked Text Relevance, only keep docs BM25 scored > 0
        if (sortBy === 'textRelevance') {
          return (bm25Scores[idx] ?? 0) > 0;
        }

        // b) numeric filters
        if (enableMinPrice  && (p.price ?? 0)         < minPrice)          return false;
        if (enableMaxPrice  && (p.price ?? Infinity)  > maxPrice)          return false;
        if (enableMinRent   && (p.rent  ?? 0)         < minRent)           return false;
        if (enableMinYield  && (p.rentalYield ?? 0)   < minYield)          return false;
        if (enableMinBeds   && (p.bedrooms  ?? 0)     < minBeds)           return false;
        if (enableMinBaths  && (p.bathrooms ?? 0)     < minBaths)          return false;
        if (enableMinSqft   && (p.squareFootage ?? 0) < minSqft)           return false;
        if (enableMinScore  && (p.investmentScore ?? 0) < minScore)        return false;
        if (enableMinDays   && (p.daysOnMarket ?? 0)  < minDaysOnMarket)   return false;
        if (enableMaxDays   && (p.daysOnMarket ?? Infinity) > maxDaysOnMarket) return false;
        if (propertyType && !p.propertyType
            ?.toLowerCase()
            .includes(propertyType.toLowerCase())
        ) return false;

        // c) text substring filters (only when not using BM25)
        if (hasQuery) {
          const inAddr =
            p.formattedAddress?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q) ||
            p.zipCode?.toLowerCase().includes(q);
          if (!inAddr) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'textRelevance') {
          return (bm25Scores[b.idx] ?? 0) - (bm25Scores[a.idx] ?? 0);
        }
        if (sortBy === 'rankingScore') {
          return b.p.rankingScore - a.p.rankingScore;
        }
        // price / rent asc/desc fallback
        const isPrice = sortBy.startsWith('price');
        const isRent  = sortBy.startsWith('rent');
        const key     = isPrice ? 'price' : isRent ? 'rent' : sortBy;
        const aVal    = (a.p as any)[key] ?? 0;
        const bVal    = (b.p as any)[key] ?? 0;
        if (sortBy.endsWith('Asc'))  return aVal - bVal;
        if (sortBy.endsWith('Desc')) return bVal - aVal;
        return 0;
      })
      // 4) unwrap back to Property[]
      .map(({ p }) => p);
  }, [
    rankedProperties,
    bm25Scores,
    searchQuery,
    sortBy,
    // numeric filter flags & values
    enableMinPrice, enableMaxPrice,
    enableMinRent, enableMinYield,
    enableMinBeds, enableMinBaths,
    enableMinSqft, enableMinScore,
    enableMinDays, enableMaxDays,
    minPrice, maxPrice,
    minRent, minYield,
    minBeds, minBaths,
    minSqft, minScore,
    minDaysOnMarket, maxDaysOnMarket,
    propertyType
  ]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', backgroundColor: '#f2f2f2', padding: '1rem' }}>
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          minYield={minYield}
          setMinYield={setMinYield}
          sortBy={sortBy}
          setSortBy={setSortBy}
          minBeds={minBeds}
          setMinBeds={setMinBeds}
          minBaths={minBaths}
          setMinBaths={setMinBaths}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          minSqft={minSqft}
          setMinSqft={setMinSqft}
          minScore={minScore}
          setMinScore={setMinScore}
          minRent={minRent}
          setMinRent={setMinRent}
          minDaysOnMarket={minDaysOnMarket}
          setMinDaysOnMarket={setMinDaysOnMarket}
          maxDaysOnMarket={maxDaysOnMarket}
          setMaxDaysOnMarket={setMaxDaysOnMarket}

          enableMinPrice={enableMinPrice}
          enableMaxPrice={enableMaxPrice}
          enableMinRent={enableMinRent}
          enableMinYield={enableMinYield}
          enableMinBeds={enableMinBeds}
          enableMinBaths={enableMinBaths}
          enableMinSqft={enableMinSqft}
          enableMinScore={enableMinScore}
          enableMinDays={enableMinDays}
          enableMaxDays={enableMaxDays}
          setEnableMinPrice={setEnableMinPrice}
          setEnableMaxPrice={setEnableMaxPrice}
          setEnableMinRent={setEnableMinRent}
          setEnableMinYield={setEnableMinYield}
          setEnableMinBeds={setEnableMinBeds}
          setEnableMinBaths={setEnableMinBaths}
          setEnableMinSqft={setEnableMinSqft}
          setEnableMinScore={setEnableMinScore}
          setEnableMinDays={setEnableMinDays}
          setEnableMaxDays={setEnableMaxDays}
        />
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
        <div style={{ paddingRight: '1.5rem' }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <h3>Search Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {filteredAndMaybeRanked.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;