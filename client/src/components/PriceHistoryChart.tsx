import React from 'react'
// Import required components from the Recharts library for rendering the line chart
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from 'recharts'

// Define the structure for each data point
interface DataPoint {
  date: string
  price: number
}

// Component to display historical price data using a line chart
const PriceHistoryChart = ({ history }: { history: Record<string, any> }) => {
  const data: DataPoint[] = Object.entries(history).map(([date, entry]: any) => ({
    date,
    price: entry.price
  }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        {/* Define the line chart and set margins */}
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          {/* Add background grid lines with dashed style */}
          <CartesianGrid strokeDasharray="3 3" />
          
          {/* X-axis represents date labels */}
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          
          {/* Y-axis represents price with formatting */}
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          
          {/* Tooltip shows formatted price on hover */}
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
            labelStyle={{ fontWeight: 'bold' }}
          />
          
          {/* Show legend for the chart line */}
          <Legend />
          
          {/* Define the main data line for price */}
          <Line
            type="monotone" // Smooth curve
            dataKey="price" // Use 'price' from data
            stroke="#4a90e2" // Line color
            strokeWidth={3} // Line thickness
            dot={{ r: 5 }} // Dot size on each data point
            activeDot={{ r: 7 }} // Dot size on hover
            name="Price ($)" // Name shown in legend
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceHistoryChart
