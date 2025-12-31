import { useState, useMemo } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { ProductSearch } from '../../components/ProductSearch';
import { ProductFilter } from '../../components/ProductFilter';
import { Pagination } from '../../components/Pagination';
import { Package } from 'lucide-react';
import type { Product, ProductCategory } from '~/types/product.type';

// Mock data - Replace this with actual API call
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Royal Canin Mini Adult - Dog Food for Small Breeds',
    description: 'Premium nutrition food specially designed for adult small breed dogs',
    category: 'food',
    price: 285000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500',
    rating: 4.8,
    sold: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Whiskas Pate - Tuna Flavor Cat Food',
    description: 'Soft and delicious pate for cats of all ages',
    category: 'food',
    price: 18000,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=500',
    rating: 4.5,
    sold: 432,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Multivitamin for Dogs & Cats',
    description: 'Essential vitamin and mineral supplement',
    category: 'medicine',
    price: 145000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500',
    rating: 4.7,
    sold: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Flea & Tick Collar for Dogs & Cats',
    description: 'Effective protection for up to 8 months',
    category: 'accessory',
    price: 95000,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500',
    rating: 4.6,
    sold: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    name: 'Dental Chew Bones for Dogs',
    description: 'Helps clean teeth and freshen breath',
    category: 'food',
    price: 55000,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500',
    rating: 4.9,
    sold: 567,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    name: 'Premium Cat Tree House',
    description: 'Perfect place for playing and resting',
    category: 'accessory',
    price: 1250000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500',
    rating: 4.8,
    sold: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '7',
    name: 'Dewormer for Dogs & Cats',
    description: 'Safe and highly effective',
    category: 'medicine',
    price: 75000,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500',
    rating: 4.4,
    sold: 312,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '8',
    name: 'Warm Knit Sweater for Small Dogs',
    description: 'Cute design with excellent warmth',
    category: 'accessory',
    price: 125000,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500',
    rating: 4.7,
    sold: 178,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '9',
    name: 'Interactive Cat Toy - Feather Wand',
    description: 'Keep your cat active and entertained',
    category: 'accessory',
    price: 45000,
    stock: 85,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500',
    rating: 4.6,
    sold: 298,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '10',
    name: 'Puppy Training Pads - 100 Pack',
    description: 'Super absorbent training pads for puppies',
    category: 'accessory',
    price: 185000,
    stock: 67,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500',
    rating: 4.3,
    sold: 412,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '11',
    name: 'Omega-3 Fish Oil for Pets',
    description: 'Promotes healthy skin and shiny coat',
    category: 'medicine',
    price: 195000,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500',
    rating: 4.8,
    sold: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '12',
    name: 'Premium Wet Cat Food - Chicken & Salmon',
    description: 'High protein formula for adult cats',
    category: 'food',
    price: 32000,
    stock: 156,
    image: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?w=500',
    rating: 4.7,
    sold: 523,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '13',
    name: 'Dog Nail Clippers with Safety Guard',
    description: 'Professional grade nail trimmer',
    category: 'accessory',
    price: 68000,
    stock: 34,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
    rating: 4.5,
    sold: 187,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '14',
    name: 'Grain-Free Dog Food - Lamb & Rice',
    description: 'Hypoallergenic formula for sensitive stomachs',
    category: 'food',
    price: 425000,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1558929996-da64ba858215?w=500',
    rating: 4.9,
    sold: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '15',
    name: 'Probiotic Supplement for Digestive Health',
    description: 'Supports healthy gut flora in dogs and cats',
    category: 'medicine',
    price: 165000,
    stock: 56,
    image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=500',
    rating: 4.6,
    sold: 145,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '16',
    name: 'Soft Pet Carrier for Travel',
    description: 'Airline approved carrier for small pets',
    category: 'accessory',
    price: 385000,
    stock: 19,
    image: 'https://images.unsplash.com/photo-1564018875149-77e2b8a3d4dd?w=500',
    rating: 4.7,
    sold: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '17',
    name: 'Catnip Toys Set - 5 Pieces',
    description: 'Variety pack of organic catnip toys',
    category: 'accessory',
    price: 78000,
    stock: 112,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500',
    rating: 4.4,
    sold: 367,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '18',
    name: 'Joint Support Chews for Senior Dogs',
    description: 'Glucosamine and chondroitin for joint health',
    category: 'medicine',
    price: 225000,
    stock: 37,
    image: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=500',
    rating: 4.8,
    sold: 203,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '19',
    name: 'Freeze-Dried Raw Dog Food - Beef',
    description: 'High protein, grain-free raw nutrition',
    category: 'food',
    price: 385000,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
    rating: 4.9,
    sold: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '20',
    name: 'Self-Cleaning Cat Litter Box',
    description: 'Automatic litter box with odor control',
    category: 'accessory',
    price: 2450000,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500',
    rating: 4.6,
    sold: 67,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '21',
    name: 'Dental Care Kit for Dogs',
    description: 'Complete dental hygiene set with toothbrush and paste',
    category: 'medicine',
    price: 125000,
    stock: 73,
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=500',
    rating: 4.5,
    sold: 189,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '22',
    name: 'Natural Cat Treats - Tuna Flakes',
    description: '100% natural tuna with no additives',
    category: 'food',
    price: 48000,
    stock: 145,
    image: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=500',
    rating: 4.8,
    sold: 456,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '23',
    name: 'Waterproof Dog Raincoat',
    description: 'Reflective raincoat with adjustable straps',
    category: 'accessory',
    price: 145000,
    stock: 62,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
    rating: 4.6,
    sold: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '24',
    name: 'Ear Cleaning Solution for Pets',
    description: 'Gentle formula for routine ear care',
    category: 'medicine',
    price: 95000,
    stock: 88,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500',
    rating: 4.4,
    sold: 276,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

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
          <ProductSearch onSearch={handleSearch} placeholder='Search pet products...' />
        </div>

        {/* Category Filter */}
        <div className='mb-8'>
          <ProductFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        </div>

        {/* Results Info */}
        <div className='mb-6 flex items-center justify-between'>
          <p className='text-sm text-gray-600'>
            Showing <span className='font-semibold text-orange-600'>{paginatedProducts.length}</span> of{' '}
            <span className='font-semibold text-orange-600'>{filteredProducts.length}</span> products
            {searchQuery && (
              <span>
                {' '}
                for "<span className='font-semibold'>{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className='mt-10 flex justify-center'>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </>
        ) : (
          // Empty State
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
              <Package className='h-12 w-12 text-gray-400' />
            </div>
            <h3 className='mb-2 text-xl font-semibold text-gray-700'>No products found</h3>
            <p className='text-gray-500'>Try searching with different keywords or select another category!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
