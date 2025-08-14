
import React, { useState, useEffect, useCallback } from 'react';
import type { Country } from '../types';
import { getFlagExplanation } from '../services/geminiService';
import Spinner from './common/Spinner';

interface FlagDetailModalProps {
  country: Country;
  onClose: () => void;
}

const FlagDetailModal: React.FC<FlagDetailModalProps> = ({ country, onClose }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFlagExplanation(country.name);
      setExplanation(result);
    } catch (err) {
      setError('Failed to fetch flag details.');
    } finally {
      setIsLoading(false);
    }
  }, [country.name]);

  useEffect(() => {
    fetchExplanation();
  }, [fetchExplanation]);

  const flagUrl = `https://flagcdn.com/w640/${country.code}.png`;

  // Handle markdown-like text for simple display
  const formattedExplanation = explanation
    .split('\n')
    .map((line, index) => {
      if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
        return <h3 key={index} className="text-xl font-semibold text-indigo-400 mt-4 mb-2">{line.replace(/#+\s/, '')}</h3>;
      }
      if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform scale-95 transition-transform duration-300 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <img src={flagUrl} alt={`${country.name} flag`} className="rounded-lg shadow-lg w-full mb-4 md:mb-0" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mt-3">{country.name}</h2>
                </div>
                <div className="w-full md:w-2/3 mt-4 md:mt-0">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-48">
                            <Spinner />
                            <p className="mt-4 text-gray-400">Revealing Symbolism...</p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {!isLoading && !error && (
                        <div className="prose prose-invert max-w-none text-gray-300">{formattedExplanation}</div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FlagDetailModal;
