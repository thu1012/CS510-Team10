import React from 'react'

interface FilterGroupProps {
  label: string
  children: React.ReactNode
}

const FilterGroup = ({ label, children }: FilterGroupProps) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default FilterGroup
