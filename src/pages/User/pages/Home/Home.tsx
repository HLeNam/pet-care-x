import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../../components/ProductCard';
import { ProductSearch } from '../../components/ProductSearch';
import { ProductFilter } from '../../components/ProductFilter';
import { Pagination } from '../../components/Pagination';
import { Package, Loader2 } from 'lucide-react';
import type { ProductCategory, ProductItemResponse } from '~/types/product.type';
import useQueryParams from '~/hooks/useQueryParams';
import useDebounce from '~/hooks/useDebounce';
import productApi from '~/apis/product.api';

const Home = () => {
  const { getParam, updateParams } = useQueryParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(getParam('search') || '');
  console.log('🚀 ~ Home ~ searchQuery:', searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    (getParam('category') as ProductCategory | 'all') || 'all'
  );
  const [currentPage, setCurrentPage] = useState(Number(getParam('page')) || 1);
  const pageSize = 8;

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Sync URL params when state changes
  useEffect(() => {
    updateParams({
      search: searchQuery || null,
      category: selectedCategory !== 'all' ? selectedCategory : null,
      page: currentPage > 1 ? currentPage : null
    });
  }, [searchQuery, selectedCategory, currentPage, updateParams]);

  // Fetch products from API
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', debouncedSearchQuery, currentPage, pageSize, selectedCategory],
    queryFn: () => {
      const apiFunction = productApi.searchProducts;
      return apiFunction({
        keyword: debouncedSearchQuery.trim() || undefined,
        pageNo: currentPage - 1, // API uses 0-based pagination
        pageSize: pageSize,
        category:
          selectedCategory !== 'all'
            ? selectedCategory === 'food'
              ? 'thức ăn'
              : selectedCategory === 'medicine'
                ? 'thuốc'
                : 'phụ kiện'
            : undefined
      });
    }
  });

  // Transform API response to match component needs
  const products = useMemo(() => {
    if (!data?.data.data.items) return [];

    return data.data.data.items.map((item: ProductItemResponse) => ({
      _id: String(item.idSanPham),
      name: item.tenSanPham,
      description: item.loaiSanPham,
      category:
        item.loaiSanPham.toLowerCase() === 'thức ăn'
          ? ('food' as ProductCategory)
          : item.loaiSanPham.toLowerCase() === 'thuốc'
            ? ('medicine' as ProductCategory)
            : item.loaiSanPham.toLowerCase() === 'phụ kiện'
              ? ('accessory' as ProductCategory)
              : ('food' as ProductCategory),
      price: parseFloat(item.giaBan),
      stock: item?.tonKho?.reduce((sum, stock) => sum + stock.soLuong, 0),
      image: item.hinhAnh,
      rating: 4.5, // Default rating since API doesn't provide it
      sold: item?.tonKho?.reduce((sum, stock) => sum + stock.soLuongDaBan, 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }, [data]);

  // Filter by category (client-side since API doesn't support it yet)
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Pagination info from API
  const totalPages = data?.data.data.totalPage || 1;
  const totalElements = data?.data.data.totalElements || 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <div className='mb-8 text-center'>
          <p className='text-4xl text-gray-600'>🐾 Everything your pet needs 💕</p>
        </div>

        {/* Search Bar */}
        <div className='mb-8'>
          <ProductSearch initialValue={searchQuery} onSearch={handleSearch} placeholder='Search pet products...' />
        </div>

        {/* Category Filter */}
        <div className='mb-8'>
          <ProductFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex flex-col items-center justify-center py-16'>
            <Loader2 className='h-12 w-12 animate-spin text-orange-600' />
            <p className='mt-4 text-gray-600'>Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100'>
              <Package className='h-12 w-12 text-red-400' />
            </div>
            <h3 className='mb-2 text-xl font-semibold text-gray-700'>Error loading products</h3>
            <p className='text-gray-500'>{error instanceof Error ? error.message : 'Something went wrong'}</p>
          </div>
        )}

        {/* Results Info */}
        {!isLoading && !isError && (
          <div className='mb-6 flex items-center justify-between'>
            <p className='text-sm text-gray-600'>
              Showing <span className='font-semibold text-orange-600'>{filteredProducts.length}</span> of{' '}
              <span className='font-semibold text-orange-600'>{totalElements}</span> products
              {searchQuery && (
                <span>
                  {' '}
                  for "<span className='font-semibold'>{searchQuery}</span>"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span>
                  {' '}
                  in <span className='font-semibold'>{selectedCategory}</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && filteredProducts.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className='mt-10 flex justify-center'>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </>
        ) : (
          !isLoading &&
          !isError && (
            // Empty State
            <div className='flex flex-col items-center justify-center py-16'>
              <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
                <Package className='h-12 w-12 text-gray-400' />
              </div>
              <h3 className='mb-2 text-xl font-semibold text-gray-700'>No products found</h3>
              <p className='text-gray-500'>Try searching with different keywords or select another category!</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
