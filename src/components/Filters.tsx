import React from 'react';
import { Search, Filter } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  genderFilter: string;
  setGenderFilter: (gender: string) => void;
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  genderFilter,
  setGenderFilter,
  ageRange,
  setAgeRange,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Search */}
        <div className="relative flex-grow w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search by name, location, or occupation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Gender Filter */}
        <div className="w-full md:w-auto">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age Range (Simplified for MVP) */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Age:</span>
          <select
            value={`${ageRange[0]}-${ageRange[1]}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setAgeRange([min, max]);
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-lg"
          >
            <option value="18-100">Any Age</option>
            <option value="18-25">18 - 25</option>
            <option value="26-35">26 - 35</option>
            <option value="36-50">36 - 50</option>
            <option value="50-100">50+</option>
          </select>
        </div>
      </div>
    </div>
  );
};
