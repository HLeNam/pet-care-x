import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '~/types/product.type';

interface ProductCardProps {
  product: Product;
}

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
  return (
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
          />
          {/* Badge for category */}
          <div className='absolute top-3 left-3'>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[product.category]}`}>
              {categoryLabels[product.category]}
            </span>
          </div>
          {/* Stock indicator */}
          {product.stock < 10 && product.stock > 0 && (
            <div className='absolute top-3 right-3'>
              <span className='rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-yellow-900'>
                Low Stock
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className='absolute top-3 right-3'>
              <span className='rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white'>Out of Stock</span>
            </div>
          )}
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
          <button
            className='flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-lime-500 px-3 py-2 text-white transition-all duration-300 hover:scale-110 hover:bg-lime-600 sm:px-4'
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to cart logic
              console.log('Add to cart:', product._id);
            }}
          >
            <ShoppingCart className='h-5 w-5 sm:hidden' />
            <span className='hidden font-semibold sm:inline'>Add to cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
