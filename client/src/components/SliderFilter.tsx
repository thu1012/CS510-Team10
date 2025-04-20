import React, { useState } from 'react'

type Props = {
  label: string
  value: number
  setValue: (val: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
}

const sliderStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '0.3rem',
  opacity: 0.6
}

const SliderFilter = ({
  label, value, setValue,
  min, max, step,
  prefix = '', suffix = ''
}: Props) => {
  const [editing, setEditing] = useState(false)

  const handleClick = () => {
    setEditing(true)
  }

  const handleBlur = () => {
    setEditing(false)
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div onClick={handleClick} style={{ cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}>
        {label}: {!editing && <span>{prefix}{value.toLocaleString()}{suffix}</span>}
      </div>
      {editing && (
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={{
            width: '100%',
            marginTop: '0.3rem',
            padding: '0.4rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '0.95rem'
          }}
        />
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        style={sliderStyle}
      />
    </div>
  )
}

export default SliderFilter