import { Search, Pill } from 'lucide-react';
import { useState } from 'react';

// Temporary mock data
const mockMedicines = [
  {
    id: 1,
    name: 'Amoxicillin 500mg',
    description: 'Kháng sinh điều trị nhiễm trùng',
    unit: 'Viên',
    stock: 150
  },
  {
    id: 2,
    name: 'Paracetamol 325mg',
    description: 'Giảm đau, hạ sốt',
    unit: 'Viên',
    stock: 200
  },
  {
    id: 3,
    name: 'Vitamin B Complex',
    description: 'Bổ sung vitamin B tổng hợp',
    unit: 'Viên',
    stock: 100
  }
];

const MedicineSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState(mockMedicines);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMedicines(mockMedicines);
    } else {
      const filtered = mockMedicines.filter((medicine) => medicine.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredMedicines(filtered);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Medicine Search</h1>
        <p className='mt-1 text-sm text-gray-600'>Search for medicine information in the system</p>
      </div>

      {/* Search Bar */}
      <div className='rounded-lg border border-gray-200 bg-white p-4'>
        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Enter medicine name to search...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
          />
        </div>
      </div>

      {/* Results */}
      <div className='space-y-3'>
        <div className='text-sm text-gray-600'>
          Found <span className='font-semibold text-gray-900'>{filteredMedicines.length}</span> result(s)
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className='rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md'
            >
              <div className='flex items-start gap-3'>
                <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50'>
                  <Pill className='h-6 w-6 text-orange-600' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='font-semibold text-gray-900'>{medicine.name}</h3>
                  <p className='mt-1 text-sm text-gray-600'>{medicine.description}</p>
                  <div className='mt-3 flex items-center justify-between'>
                    <span className='text-xs text-gray-500'>Unit: {medicine.unit}</span>
                    <span className='rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                      Stock: {medicine.stock}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMedicines.length === 0 && (
          <div className='rounded-lg border border-gray-200 bg-white py-12 text-center'>
            <Pill className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-sm font-medium text-gray-900'>No medicine found</h3>
            <p className='mt-2 text-sm text-gray-500'>No medicine matches the keyword "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
