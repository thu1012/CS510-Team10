import React from 'react'

const SearchBar = () => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search properties..."
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button style={{ padding: '0.5rem 1rem' }}>Search</button>
    </div>
  )
}

export default SearchBar
