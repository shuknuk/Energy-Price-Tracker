
import React, { useState, useCallback, useMemo } from 'react';
import type { EnergyPricePoint, CalculationResult, ApplianceDetails } from '../types';
import { Card, CardHeader } from './ui/Card';

interface ApplianceCostCalculatorProps {
  data: EnergyPricePoint[];
}

const calculateCost = (
  data: EnergyPricePoint[],
  appliance: ApplianceDetails
): { cheapest: CalculationResult; mostExpensive: CalculationResult } | null => {
  if (data.length === 0 || appliance.duration <= 0 || appliance.power <= 0) {
    return null;
  }

  const powerKw = appliance.power / 1000;
  const durationHours = appliance.duration;
  let cheapest: CalculationResult = { startTime: data[0].timestamp, cost: Infinity };
  let mostExpensive: CalculationResult = { startTime: data[0].timestamp, cost: -Infinity };

  // A "sliding window" approach
  for (let i = 0; i <= data.length - durationHours; i++) {
    let windowCost = 0;
    for (let j = 0; j < durationHours; j++) {
      windowCost += data[i + j].price * powerKw; // Cost for one hour slice
    }
    
    // As the data is hourly, the cost is already for the duration.
    // If we wanted to be more precise with non-integer durations, we'd average the price
    // but for hourly data, summing up hourly price * powerKw is correct.
    const averagePrice = windowCost / durationHours;
    const totalCost = averagePrice * durationHours;

    if (totalCost < cheapest.cost) {
      cheapest = { startTime: data[i].timestamp, cost: totalCost };
    }
    if (totalCost > mostExpensive.cost) {
      mostExpensive = { startTime: data[i].timestamp, cost: totalCost };
    }
  }

  return { cheapest, mostExpensive };
};

export const ApplianceCostCalculator: React.FC<ApplianceCostCalculatorProps> = ({ data }) => {
  const [power, setPower] = useState<string>('1800'); // Default: Dishwasher
  const [duration, setDuration] = useState<string>('2'); // Default: 2 hours
  const [result, setResult] = useState<{ cheapest: CalculationResult; mostExpensive: CalculationResult } | null>(null);

  const handleCalculate = useCallback(() => {
    const applianceDetails: ApplianceDetails = {
      power: parseFloat(power) || 0,
      duration: parseFloat(duration) || 0,
    };
    const calculation = calculateCost(data, applianceDetails);
    setResult(calculation);
  }, [power, duration, data]);

  // Perform initial calculation on load
  React.useEffect(() => {
    handleCalculate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // Only re-run when data loads

  const formatTime = (date: Date) => date.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric' });

  return (
    <Card>
      <CardHeader
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
        title="Appliance Cost Calculator"
      />
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="power" className="block text-sm font-medium text-gray-400">Appliance Power (Watts)</label>
            <input
              type="number"
              id="power"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-2"
              placeholder="e.g., 1800"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-400">Run Duration (Hours)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-2"
              placeholder="e.g., 2"
            />
          </div>
        </div>
        <button
          onClick={handleCalculate}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Find Best Time
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-900/50 border border-green-500/30 p-4 rounded-lg">
            <h3 className="font-bold text-green-300">Cheapest Window to Run</h3>
            <p className="text-gray-200">Starts at: <span className="font-semibold text-white">{formatTime(result.cheapest.startTime)}</span></p>
            <p className="text-gray-200">Estimated Cost: <span className="font-semibold text-white">${result.cheapest.cost.toFixed(2)}</span></p>
          </div>
          <div className="bg-red-900/50 border border-red-500/30 p-4 rounded-lg">
            <h3 className="font-bold text-red-300">Most Expensive Window to Run</h3>
            <p className="text-gray-200">Starts at: <span className="font-semibold text-white">{formatTime(result.mostExpensive.startTime)}</span></p>
            <p className="text-gray-200">Estimated Cost: <span className="font-semibold text-white">${result.mostExpensive.cost.toFixed(2)}</span></p>
          </div>
        </div>
      )}
    </Card>
  );
};
