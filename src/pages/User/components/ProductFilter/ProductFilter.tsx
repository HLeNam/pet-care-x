import { Filter } from 'lucide-react';

type ProductCategory = 'food' | 'medicine' | 'accessory';

interface ProductFilterProps {
  selectedCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

interface CategoryOption {
  value: ProductCategory | 'all';
  label: string;
  icon: string;
}

const categories: CategoryOption[] = [
  {
    value: 'all',
    label: 'All',
    icon: '🐾'
  },
  {
    value: 'food',
    label: 'Food',
    icon: '🍖'
  },
  {
    value: 'medicine',
    label: 'Medicine',
    icon: '💊'
  },
  {
    value: 'accessory',
    label: 'Accessories',
    icon: '🎀'
  }
];

const ProductFilter = ({ selectedCategory, onCategoryChange }: ProductFilterProps) => {
  return (
    <div className='w-full'>
      {/* Filter Header */}
      <div className='mb-4 flex items-center gap-2'>
        <Filter className='h-5 w-5 text-orange-500' />
        <h3 className='text-lg font-semibold text-gray-800'>Product Categories</h3>
      </div>

      {/* Category Filters */}
      <div className='flex flex-wrap gap-3'>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.value;
          return (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`group relative transform cursor-pointer overflow-hidden rounded-full border-2 px-4 py-1 font-semibold transition-all duration-300 ${
                isSelected
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-orange-500 hover:text-orange-500'
              }`}
            >
              {/* Content */}
              <span className='relative z-10 flex items-center gap-2'>
                <span className='text-lg'>{category.icon}</span>
                <span>{category.label}</span>
              </span>

              {/* Animated border for selected */}
              {isSelected && <span className='absolute inset-0 animate-pulse rounded-full border-2 border-white/50' />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFilter;
