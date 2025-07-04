import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch } = FiIcons;

const SearchFilter = ({ searchTerm, setSearchTerm, filterType, setFilterType, sortBy, setSortBy }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <SafeIcon 
            icon={FiSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
          />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        >
          <option value="all">All Types</option>
          <option value="patent">Patents</option>
          <option value="trademark">Trademarks</option>
          <option value="copyright">Copyrights</option>
          <option value="trade-secret">Trade Secrets</option>
        </select>

        {/* Sort by */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        >
          <option value="createdAt">Recently Added</option>
          <option value="name">Name (A-Z)</option>
          <option value="type">Type</option>
          <option value="expiryDate">Expiry Date</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;