import React from 'react'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'
import PropertyCard from '../components/PropertyCard'

const Home = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: '250px', backgroundColor: '#f2f2f2', padding: '1rem' }}>
        <Filters />
      </div>

      <div style={{ flex: 1, padding: '1rem' }}>
        <SearchBar />
        <h3>Search Results</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[1, 2, 3, 4].map((id) => (
            <PropertyCard key={id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
