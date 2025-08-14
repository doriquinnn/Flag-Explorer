
import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../constants';
import type { Country } from '../types';
import FlagCard from './FlagCard';
import FlagDetailModal from './FlagDetailModal';

const LearnMode: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleCloseModal = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-indigo-400">Learn About World Flags</h2>
        <p className="mt-2 text-lg text-gray-400">Click on a flag to discover the meaning behind its colors and symbols.</p>
      </div>

      <div className="mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {filteredCountries.map(country => (
          <FlagCard key={country.code} country={country} onSelect={handleSelectCountry} />
        ))}
      </div>

      {selectedCountry && (
        <FlagDetailModal country={selectedCountry} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default LearnMode;
