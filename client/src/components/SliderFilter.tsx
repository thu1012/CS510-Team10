import React, { useState } from 'react';

// Define the type for the props that the SliderFilter component will receive.
type Props = {
  label: string; // The label to display for the slider filter.
  value: number; // The current value of the slider.
  setValue: (val: number) => void; // A function to update the value of the slider.
  min: number; // The minimum value the slider can take.
  max: number; // The maximum value the slider can take.
  step: number; // The increment step for the slider.
  prefix?: string; // An optional prefix to display before the value.
  suffix?: string; // An optional suffix to display after the value.
  enabled?: boolean; // An optional boolean to control if the filter is enabled.
  setEnabled?: (enabled: boolean) => void; // An optional function to update the enabled state of the filter.
};

// Styling for the range slider input element.
const sliderStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '0.3rem',
  opacity: 0.6, // Slightly transparent to indicate it's a slider.
};

// SliderFilter component: A reusable component for creating range slider filters with optional labels, prefixes, suffixes, and enable/disable functionality.
const SliderFilter = ({
  label, value, setValue,
  min, max, step,
  prefix = '', suffix = '',
  enabled = true,
  setEnabled,
}: Props) => {
  // State to track whether the numeric input field is currently being edited.
  const [editing, setEditing] = useState(false);

  // Function to set the editing state to true when the label area is clicked.
  const handleClick = () => setEditing(true);
  // Function to set the editing state to false when the numeric input field loses focus.
  const handleBlur = () => setEditing(false);

  // Determine whether to show the slider. It's shown if the filter is enabled AND the setEnabled function is provided (indicating toggle functionality).
  const showSlider = enabled && setEnabled;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* Container for the label and the enable/disable toggle (if available). */}
      <div
        onClick={handleClick} // Make the label area clickable to focus the numeric input.
        style={{
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 500,
          display: 'flex',
          justifyContent: 'space-between', // Align label and checkbox to opposite ends.
          alignItems: 'center', // Vertically align label and checkbox.
        }}
      >
        <span>
          {label}: {/* Display the label */}
          {!editing && ( // If not editing, display the current value with prefix and suffix.
            <span>{prefix}{value.toLocaleString()}{suffix}</span>
          )}
        </span>

        {/* Checkbox to enable or disable the filter. Only rendered if setEnabled prop is provided. */}
        {setEnabled && (
          <input
            type="checkbox"
            checked={enabled} // Reflect the current enabled state.
            onChange={(e) => setEnabled(e.target.checked)} // Update the enabled state when the checkbox changes.
            style={{ marginLeft: '0.5rem' }}
          />
        )}
      </div>

      {/* Conditional rendering for the slider and the number input. */}
      {showSlider && (
        <>
          {editing && ( // Show the number input field when editing is true.
            <input
              type="number"
              value={value} // Controlled component: value reflects the state.
              onChange={(e) => setValue(+e.target.value)} // Update the value when the input changes (convert to number).
              onBlur={handleBlur} // Stop editing when focus is lost.
              autoFocus // Automatically focus the input when it appears.
              style={{
                width: '100%',
                marginTop: '0.3rem',
                padding: '0.4rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '0.95rem',
              }}
            />
          )}
          <input
            type="range"
            min={min} // Minimum value of the slider.
            max={max} // Maximum value of the slider.
            step={step} // Increment step of the slider.
            value={value} // Current value of the slider.
            onChange={(e) => setValue(+e.target.value)} // Update the value when the slider changes (convert to number).
            style={sliderStyle} // Apply the slider styling.
          />
        </>
      )}
    </div>
  );
};

export default SliderFilter;