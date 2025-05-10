import React from 'react'

interface FilterGroupProps {
  label: string                    
  children: React.ReactNode 
}

/**
 * A simple layout component for grouping filter UI elements with a label.
 *
 * @param label - Descriptive label for the filter group.
 * @param children - React elements rendered inside the group (e.g., filter controls).
 */
const FilterGroup = ({ label, children }: FilterGroupProps) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Render the label above the filter elements */}
      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {/* Render child elements like inputs, dropdowns, etc. */}
      {children}
    </div>
  )
}

export default FilterGroup
