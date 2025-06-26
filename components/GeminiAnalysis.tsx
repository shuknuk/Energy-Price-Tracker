
import React, { useState, useEffect } from 'react';
import { getEnergyAnalysis } from '../services/geminiService';
import type { EnergyPricePoint } from '../types';
import { Card, CardHeader } from './ui/Card';
import { Spinner } from './ui/Spinner';

interface GeminiAnalysisProps {
  data: EnergyPricePoint[];
}

export const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ data }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data.length > 0) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Check for placeholder API key
          if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_API_KEY') {
             throw new Error("Gemini API key not configured.");
          }
          const result = await getEnergyAnalysis(data);
          setAnalysis(result);
        } catch (err: any) {
           setError(err.message || "Failed to get AI analysis.");
           console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAnalysis();
    }
  }, [data]);

  return (
    <Card>
      <CardHeader
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
        title="AI-Powered Analysis"
      />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48">
            <Spinner />
            <p className="mt-4 text-gray-400">Gemini is analyzing your data...</p>
        </div>
      ) : error ? (
        <div className="bg-yellow-900/50 border border-yellow-500/30 p-4 rounded-lg text-yellow-200">
            <h4 className="font-bold">Analysis Unavailable</h4>
            <p className="text-sm">{error} Please ensure your Gemini API key is correctly configured in the environment variables.</p>
        </div>
      ) : (
        <div className="text-gray-300 space-y-4 whitespace-pre-wrap font-mono text-sm">
          {analysis}
        </div>
      )}
    </Card>
  );
};
