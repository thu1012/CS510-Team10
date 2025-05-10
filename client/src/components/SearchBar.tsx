import React from 'react'

// Define props for the component: current query and setter function
type Props = {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

// Stateless functional component for the search input bar
const SearchBar = ({ searchQuery, setSearchQuery }: Props) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search by address, city, or ZIP..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        style={{
          width: '100%',          
          padding: '0.5rem',      
          fontSize: '1rem',     
          borderRadius: '6px',    
          border: '1px solid #ccc'
        }}
      />
    </div>
  )
}

export default SearchBar
