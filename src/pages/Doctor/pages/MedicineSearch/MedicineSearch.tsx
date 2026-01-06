import { Search, Pill } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Pagination } from '~/pages/User/components/Pagination';

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
  },
  {
    id: 4,
    name: 'Cephalexin 250mg',
    description: 'Kháng sinh phổ rộng',
    unit: 'Viên',
    stock: 120
  },
  {
    id: 5,
    name: 'Metronidazole 500mg',
    description: 'Kháng sinh chống nhiễm khuẩn kỵ khí',
    unit: 'Viên',
    stock: 90
  },
  {
    id: 6,
    name: 'Doxycycline 100mg',
    description: 'Kháng sinh nhóm tetracycline',
    unit: 'Viên',
    stock: 110
  },
  {
    id: 7,
    name: 'Prednisolone 5mg',
    description: 'Thuốc chống viêm corticosteroid',
    unit: 'Viên',
    stock: 80
  },
  {
    id: 8,
    name: 'Omeprazole 20mg',
    description: 'Thuốc giảm acid dạ dày',
    unit: 'Viên',
    stock: 160
  },
  {
    id: 9,
    name: 'Cetirizine 10mg',
    description: 'Thuốc kháng histamine chống dị ứng',
    unit: 'Viên',
    stock: 140
  },
  {
    id: 10,
    name: 'Meloxicam 7.5mg',
    description: 'Thuốc chống viêm không steroid',
    unit: 'Viên',
    stock: 95
  },
  {
    id: 11,
    name: 'Tramadol 50mg',
    description: 'Thuốc giảm đau dạng opioid',
    unit: 'Viên',
    stock: 70
  },
  {
    id: 12,
    name: 'Gabapentin 100mg',
    description: 'Thuốc điều trị đau thần kinh',
    unit: 'Viên',
    stock: 85
  },
  {
    id: 13,
    name: 'Furosemide 40mg',
    description: 'Thuốc lợi tiểu',
    unit: 'Viên',
    stock: 130
  },
  {
    id: 14,
    name: 'Enalapril 5mg',
    description: 'Thuốc điều trị tăng huyết áp',
    unit: 'Viên',
    stock: 115
  },
  {
    id: 15,
    name: 'Levothyroxine 100mcg',
    description: 'Hormone tuyến giáp',
    unit: 'Viên',
    stock: 105
  },
  {
    id: 16,
    name: 'Insulin Regular',
    description: 'Insulin điều trị tiểu đường',
    unit: 'Lọ',
    stock: 45
  },
  {
    id: 17,
    name: 'Buprenorphine 0.3mg',
    description: 'Thuốc giảm đau mạnh',
    unit: 'Ống',
    stock: 55
  },
  {
    id: 18,
    name: 'Maropitant 16mg',
    description: 'Thuốc chống nôn mửa',
    unit: 'Viên',
    stock: 75
  },
  {
    id: 19,
    name: 'Famotidine 20mg',
    description: 'Thuốc giảm acid dạ dày',
    unit: 'Viên',
    stock: 125
  },
  {
    id: 20,
    name: 'Trazodone 50mg',
    description: 'Thuốc giảm lo âu, an thần',
    unit: 'Viên',
    stock: 60
  },
  {
    id: 21,
    name: 'Enrofloxacin 50mg',
    description: 'Kháng sinh fluoroquinolone cho thú y',
    unit: 'Viên',
    stock: 100
  },
  {
    id: 22,
    name: 'Carprofen 75mg',
    description: 'Thuốc chống viêm NSAID cho chó',
    unit: 'Viên',
    stock: 110
  },
  {
    id: 23,
    name: 'Azithromycin 250mg',
    description: 'Kháng sinh macrolide',
    unit: 'Viên',
    stock: 88
  },
  {
    id: 24,
    name: 'Clindamycin 150mg',
    description: 'Kháng sinh chống nhiễm khuẩn',
    unit: 'Viên',
    stock: 92
  },
  {
    id: 25,
    name: 'Ivermectin 1%',
    description: 'Thuốc tẩy giun, trị ký sinh trùng',
    unit: 'Lọ',
    stock: 65
  },
  {
    id: 26,
    name: 'Fenbendazole 500mg',
    description: 'Thuốc tẩy giun đường tiêu hóa',
    unit: 'Gói',
    stock: 78
  },
  {
    id: 27,
    name: 'Acepromazine 10mg',
    description: 'Thuốc an thần',
    unit: 'Viên',
    stock: 50
  },
  {
    id: 28,
    name: 'Dexamethasone 0.5mg',
    description: 'Corticosteroid mạnh',
    unit: 'Viên',
    stock: 95
  },
  {
    id: 29,
    name: 'Pimobendan 5mg',
    description: 'Thuốc điều trị suy tim',
    unit: 'Viên',
    stock: 72
  },
  {
    id: 30,
    name: 'Sildenafil 20mg',
    description: 'Thuốc điều trị tăng áp lực động mạch phổi',
    unit: 'Viên',
    stock: 48
  }
];

const ITEMS_PER_PAGE = 12;

const MedicineSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMedicines = useMemo(() => {
    if (searchQuery.trim() === '') {
      return mockMedicines;
    }
    return mockMedicines.filter((medicine) => medicine.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);

  const paginatedMedicines = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMedicines.slice(startIndex, endIndex);
  }, [filteredMedicines, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          {filteredMedicines.length > ITEMS_PER_PAGE && (
            <span className='ml-2 text-gray-500'>
              (Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredMedicines.length)})
            </span>
          )}
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {paginatedMedicines.map((medicine) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center pt-4'>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

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
