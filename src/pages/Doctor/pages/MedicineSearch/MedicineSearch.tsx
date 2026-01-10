import { Search, Pill } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '~/pages/User/components/Pagination';
import productApi from '~/apis/product.api';
import useQueryParams from '~/hooks/useQueryParams';
import useDebounce from '~/hooks/useDebounce';
import type { ProductListParams } from '~/types/product.type';

const ITEMS_PER_PAGE = 8;

const MedicineSearch = () => {
  const { params, updateParams, getParam } = useQueryParams();
  const [searchQuery, setSearchQuery] = useState(getParam('keyword', ''));
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const currentPage = Number(params.pageNo) || 1;
  const pageSize = Number(params.pageSize) || ITEMS_PER_PAGE;

  // Build API params from URL - use debounced search query
  const apiParams: ProductListParams = {
    keyword: debouncedSearchQuery || undefined,
    pageNo: currentPage - 1, // API uses 0-based indexing
    pageSize: pageSize,
    sortBy: params.sortBy as string | undefined,
    sortDir: params.sortDir as string | undefined
  };

  // Fetch medicines from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['medicines', apiParams],
    queryFn: () => productApi.searchMedicines(apiParams),
    enabled: true
  });

  const medicines = data?.data.data?.items || [];
  const totalPages = data?.data.data?.totalPage || 0;
  const totalElements = data?.data.data?.totalElements || 0;

  // Sync debounced search query with URL params
  useEffect(() => {
    updateParams({
      keyword: debouncedSearchQuery || null,
      pageNo: debouncedSearchQuery !== getParam('keyword', '') ? null : currentPage > 1 ? currentPage : null
    });
  }, [debouncedSearchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    updateParams({
      pageNo: page > 1 ? page : null
    });
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
        {isLoading ? (
          <div className='rounded-lg border border-gray-200 bg-white py-12 text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange-600'></div>
            <p className='mt-4 text-sm text-gray-500'>Loading medicines...</p>
          </div>
        ) : error ? (
          <div className='rounded-lg border border-red-200 bg-red-50 py-12 text-center'>
            <p className='text-sm text-red-600'>Error loading medicines. Please try again.</p>
          </div>
        ) : (
          <>
            <div className='text-sm text-gray-600'>
              Found <span className='font-semibold text-gray-900'>{totalElements}</span> result(s)
              {totalElements > pageSize && (
                <span className='ml-2 text-gray-500'>
                  (Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)})
                </span>
              )}
            </div>

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {medicines.map((medicine) => (
                <div
                  key={medicine.idSanPham}
                  className='rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md'
                >
                  <div className='flex items-start gap-3'>
                    <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50'>
                      <Pill className='h-6 w-6 text-orange-600' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h3 className='font-semibold text-gray-900'>{medicine.tenSanPham}</h3>
                      <p className='mt-1 text-sm text-gray-600'>
                        {medicine.loaiSanPham} - {medicine.maSanPham}
                      </p>
                      <div className='mt-3 flex items-center justify-between'>
                        <span className='text-sm font-medium text-orange-600'>
                          {Number(medicine.giaBan).toLocaleString('vi-VN')} VNĐ
                        </span>
                        <span className='text-xs text-gray-500'>
                          Exp: {new Date(medicine.hanSuDung).toLocaleDateString('vi-VN')}
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
            {medicines.length === 0 && (
              <div className='rounded-lg border border-gray-200 bg-white py-12 text-center'>
                <Pill className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-4 text-sm font-medium text-gray-900'>No medicine found</h3>
                <p className='mt-2 text-sm text-gray-500'>
                  {searchQuery
                    ? `No medicine matches the keyword "${searchQuery}"`
                    : 'No medicine available in the system'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedicineSearch;
