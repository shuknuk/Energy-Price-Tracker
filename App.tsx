
import React, { useState, useEffect } from 'react';
import { EnergyPriceChart } from './components/EnergyPriceChart';
import { ApplianceCostCalculator } from './components/ApplianceCostCalculator';
import { GeminiAnalysis } from './components/GeminiAnalysis';
import { mockEnergyService } from './services/eiaService';
import type { EnergyPricePoint } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyPricePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // In a real app, this would be an API call. We use a mock service.
        const data = await mockEnergyService.getWeeklyPriceData();
        setEnergyData(data);
      } catch (err) {
        setError("Failed to fetch energy data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <EnergyPriceChart data={energyData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ApplianceCostCalculator data={energyData} />
              <GeminiAnalysis data={energyData} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
