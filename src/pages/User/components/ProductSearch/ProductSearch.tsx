import { Search, X } from 'lucide-react';
import { useState, useCallback } from 'react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const ProductSearch = ({ onSearch, placeholder = 'Search products...' }: ProductSearchProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <form onSubmit={handleSubmit} className='relative w-full'>
      <div className='relative flex items-center'>
        <Search className='absolute left-4 h-5 w-5 text-gray-400' />
        <input
          type='text'
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className='w-full rounded-full border-2 border-gray-200 bg-white py-3 pr-12 pl-12 text-gray-800 shadow transition-all duration-300 placeholder:text-gray-400 focus:border-lime-400 focus:ring-2 focus:ring-lime-200 focus:outline-none'
        />
        {searchValue && (
          <button
            type='button'
            onClick={handleClear}
            className='absolute right-4 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-all hover:bg-gray-300'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductSearch;
