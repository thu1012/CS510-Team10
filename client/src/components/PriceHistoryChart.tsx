import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from 'recharts'

interface DataPoint {
  date: string
  price: number
}

const PriceHistoryChart = ({ history }: { history: Record<string, any> }) => {
  const data: DataPoint[] = Object.entries(history).map(([date, entry]: any) => ({
    date,
    price: entry.price
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4a90e2"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            name="Price ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceHistoryChart
