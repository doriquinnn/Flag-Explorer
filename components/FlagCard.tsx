
import React from 'react';
import type { Country } from '../types';

interface FlagCardProps {
  country: Country;
  onSelect: (country: Country) => void;
}

const FlagCard: React.FC<FlagCardProps> = ({ country, onSelect }) => {
  const flagUrl = `https://flagcdn.com/w320/${country.code}.png`;

  return (
    <div
      onClick={() => onSelect(country)}
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-w-3 aspect-h-2 w-full">
         <img src={flagUrl} alt={`${country.name} flag`} className="object-cover w-full h-full" loading="lazy" />
      </div>
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold text-gray-200 group-hover:text-indigo-400 transition-colors duration-300 truncate">{country.name}</h3>
      </div>
    </div>
  );
};

export default FlagCard;
