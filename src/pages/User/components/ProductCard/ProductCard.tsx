import { Link } from 'react-router-dom';
import { X, Store } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '~/types/product.type';

interface ProductCardProps {
  product: Product;
}

// Mock branches - Replace with API call
const mockBranches = [
  { _id: 'branch-1', name: 'Chi nhánh Quận 1', stock: 15 },
  { _id: 'branch-2', name: 'Chi nhánh Quận 3', stock: 8 },
  { _id: 'branch-3', name: 'Chi nhánh Quận 7', stock: 22 },
  { _id: 'branch-4', name: 'Chi nhánh Thủ Đức', stock: 0 }
];

const categoryLabels: Record<Product['category'], string> = {
  food: 'Food',
  medicine: 'Medicine',
  accessory: 'Accessory'
};

const categoryColors: Record<Product['category'], string> = {
  food: 'bg-orange-100 text-orange-700',
  medicine: 'bg-green-100 text-green-700',
  accessory: 'bg-blue-100 text-blue-700'
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');

  const closeBranchModal = () => {
    setIsBranchModalOpen(false);
    setSelectedBranch('');
  };

  return (
    <>
      <Link
        to={`/products/${product._id}`}
        className='group relative overflow-hidden rounded-2xl border border-gray-200 bg-white'
      >
        {/* Product Image */}
        <div className='p-2'>
          <div className='relative aspect-square overflow-hidden rounded-lg bg-orange-50'>
            <img
              src={product.image}
              alt={product.name}
              className='h-full w-full object-cover transition-transform duration-300'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/400x400?text=No+Image';
              }}
            />
            {/* Badge for category */}
            <div className='absolute top-3 left-3'>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[product.category]}`}>
                {categoryLabels[product.category]}
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className='p-4'>
          {/* Product Name */}
          <h3 className='mb-2 line-clamp-2 min-h-[3rem] text-lg font-semibold text-gray-800 transition-colors group-hover:text-orange-600'>
            {product.name}
          </h3>

          {/* Price and Cart */}
          <div className='flex items-center justify-between gap-2'>
            <div className='flex flex-1 flex-col overflow-hidden'>
              <span className='truncate text-xl font-bold text-orange-600 sm:text-2xl'>
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <button className='flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-lime-500 px-3 py-1 text-white transition-all duration-300 hover:scale-110 hover:bg-lime-600 sm:px-4 sm:py-2'>
              <span className='text-sm font-semibold sm:inline'>View Detail</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Branch Selection Modal */}
      {isBranchModalOpen && (
        <div
          className='bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4'
          onClick={closeBranchModal}
        >
          <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-xl' onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-800 sm:text-xl'>Select Branch</h3>
              <button
                onClick={closeBranchModal}
                className='cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                aria-label='Close modal'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Product Info */}
            <div className='mb-4 flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3'>
              <img
                src={product.image}
                alt={product.name}
                className='h-16 w-16 rounded-lg object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/128x128?text=No+Image';
                }}
              />
              <div className='flex-1'>
                <h4 className='line-clamp-2 text-sm font-semibold text-gray-800'>{product.name}</h4>
                <p className='mt-1 text-base font-bold text-orange-600'>{product.price.toLocaleString('vi-VN')}₫</p>
              </div>
            </div>

            {/* Branch Selection */}
            <div className='mb-6'>
              <label className='mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700'>
                <Store className='h-4 w-4 text-gray-600' />
                Choose a branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className='w-full cursor-pointer rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 transition-colors focus:border-lime-400 focus:ring-2 focus:ring-lime-200 focus:outline-none'
              >
                <option value=''>-- Select Branch --</option>
                {mockBranches.map((branch) => (
                  <option key={branch._id} value={branch._id} disabled={branch.stock === 0}>
                    {branch.name} {branch.stock === 0 ? '(Out of stock)' : `(${branch.stock} items)`}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className='flex gap-3'>
              <button
                onClick={closeBranchModal}
                className='flex-1 cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
