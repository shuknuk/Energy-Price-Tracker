
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EnergyPricePoint } from '../types';
import { Card, CardHeader } from './ui/Card';

interface EnergyPriceChartProps {
  data: EnergyPricePoint[];
}

export const EnergyPriceChart: React.FC<EnergyPriceChartProps> = ({ data }) => {
  const formatXAxis = (tickItem: Date) => {
    // Show 'Mon', 'Tue', etc.
    return tickItem.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const formatTooltipLabel = (label: Date) => {
    return label.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const formatYAxis = (tickItem: number) => {
    return `$${tickItem.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
        title="Hourly Energy Price (Last 7 Days)"
      />
      <div className="h-96 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis unit="/kWh" tickFormatter={formatYAxis} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <Tooltip
              labelFormatter={formatTooltipLabel}
              formatter={(value: number) => [`$${value.toFixed(4)}/kWh`, 'Price']}
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#e5e7eb' }}
              labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
            />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} dot={false} name="Price ($/kWh)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
