import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Package, X } from 'lucide-react';
import { useCart } from '~/hooks/useCart';
import { toast } from 'react-toastify';
import { useState } from 'react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    productId: string;
    branchId: string;
    productName: string;
  } | null>(null);

  const handleUpdateQuantity = (productId: string, branchId: string, newQuantity: number) => {
    updateQuantity(productId, branchId, newQuantity);
  };

  const openDeleteModal = (productId: string, branchId: string, productName: string) => {
    setItemToDelete({ productId, branchId, productName });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.productId, itemToDelete.branchId);
      toast.success('Product removed from cart');
      closeDeleteModal();
    }
  };

  const handleCheckout = () => {
    // TODO: Navigate to checkout page
    toast.success('Proceeding to checkout...');
    navigate('/checkout');
  };

  if (cart.totalItems === 0) {
    return (
      <div className='Container py-6 sm:py-8 lg:py-12'>
        <div className='flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20'>
          <ShoppingCart className='mb-3 h-20 w-20 text-gray-300 sm:mb-4 sm:h-28 sm:w-28 lg:h-32 lg:w-32' />
          <h2 className='mb-2 text-xl font-semibold text-gray-700 sm:text-2xl lg:text-3xl'>Your cart is empty</h2>
          <p className='mb-4 text-center text-sm text-gray-500 sm:mb-6 sm:text-base'>
            Add some products to get started!
          </p>
          <Link
            to='/'
            className='rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 sm:px-8 sm:py-3 sm:text-base'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='Container py-4 sm:py-6 lg:py-8 xl:py-10'>
      {/* Header */}
      <div className='mb-4 sm:mb-6 lg:mb-8'>
        <button
          onClick={() => navigate(-1)}
          className='mb-3 flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-orange-600 sm:mb-4 sm:text-base'
        >
          <ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
          <span className='font-medium'>Continue Shopping</span>
        </button>
        <h1 className='text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl'>Shopping Cart</h1>
        <p className='mt-1 text-xs text-gray-600 sm:mt-1.5 sm:text-sm lg:text-base'>
          {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className='grid gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8'>
        {/* Cart Items */}
        <div className='space-y-3 sm:space-y-4 lg:col-span-2'>
          {cart.items.map((item) => (
            <div
              key={`${item.productId}-${item.branchId}`}
              className='rounded-xl border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4 lg:p-5'
            >
              <div className='flex gap-3 sm:gap-4'>
                {/* Product Image */}
                <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 sm:h-24 sm:w-24 lg:h-28 lg:w-28'>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x400?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className='flex flex-1 flex-col justify-between'>
                  <div>
                    <h3 className='mb-1 line-clamp-2 text-sm leading-tight font-semibold text-gray-800 sm:text-base lg:text-lg'>
                      {item.productName}
                    </h3>
                    <div className='flex items-center gap-1.5 text-xs text-gray-500 sm:gap-2 sm:text-sm'>
                      <Package className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
                      <span>{item.branchName}</span>
                    </div>
                    <p className='mt-1.5 text-sm font-semibold text-orange-600 sm:mt-2 sm:text-base lg:text-lg'>
                      {item.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className='mt-2 flex flex-wrap items-center justify-between sm:mt-3'>
                    <div className='flex items-center gap-1.5 sm:gap-2 lg:gap-3'>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.branchId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-orange-400 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8 lg:h-9 lg:w-9'
                      >
                        <Minus className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                      </button>
                      <span className='min-w-[2rem] text-center text-sm font-semibold text-gray-800 sm:min-w-[2.5rem] sm:text-base lg:text-lg'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.branchId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-orange-400 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8 lg:h-9 lg:w-9'
                      >
                        <Plus className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className='flex w-full items-center justify-between gap-2 sm:w-auto sm:gap-3 lg:gap-4'>
                      <div className='mt-2 sm:mt-0 sm:text-right'>
                        <p className='text-xs text-gray-500 sm:text-sm'>Subtotal</p>
                        <p className='text-sm font-bold text-gray-800 sm:text-base lg:text-lg'>
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      <button
                        onClick={() => openDeleteModal(item.productId, item.branchId, item.productName)}
                        className='cursor-pointer rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 sm:p-2'
                        aria-label='Remove item'
                      >
                        <Trash2 className='h-4 w-4 sm:h-5 sm:w-5' />
                      </button>
                    </div>
                  </div>

                  {/* Stock Info */}
                  {item.quantity >= item.maxStock && (
                    <p className='mt-1.5 text-xs text-orange-600 sm:mt-2 sm:text-sm'>
                      Maximum stock reached ({item.maxStock})
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-20 rounded-xl border border-gray-200 bg-white p-4 sm:top-24 sm:p-5 lg:p-6'>
            <h2 className='mb-3 text-lg font-bold text-gray-800 sm:mb-4 sm:text-xl'>Order Summary</h2>

            <div className='space-y-2.5 border-b border-gray-200 pb-3 sm:space-y-3 sm:pb-4'>
              <div className='flex items-center justify-between text-sm sm:text-base'>
                <span className='text-gray-600'>Subtotal ({cart.totalItems} items)</span>
                <span className='font-semibold text-gray-800'>{cart.totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className='flex items-center justify-between text-sm sm:text-base'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-semibold text-gray-800'>Free</span>
              </div>
              <div className='flex items-center justify-between text-sm sm:text-base'>
                <span className='text-gray-600'>Tax</span>
                <span className='font-semibold text-gray-800'>Calculated at checkout</span>
              </div>
            </div>

            <div className='my-3 flex items-center justify-between border-b border-gray-200 pb-3 sm:my-4 sm:pb-4'>
              <span className='text-base font-bold text-gray-800 sm:text-lg'>Total</span>
              <span className='text-xl font-bold text-orange-600 sm:text-2xl'>
                {cart.totalPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-500 py-2.5 text-base font-bold text-white transition-all hover:bg-orange-600 sm:py-3 sm:text-lg'
            >
              <ShoppingCart className='h-5 w-5 sm:h-5 sm:w-5' />
              Proceed to Checkout
            </button>

            <p className='mt-3 text-center text-xs text-gray-500 sm:mt-4 sm:text-sm'>
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div
          className='bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4'
          onClick={closeDeleteModal}
        >
          <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-xl' onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-800 sm:text-xl'>Remove Item</h3>
              <button
                onClick={closeDeleteModal}
                className='rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                aria-label='Close modal'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Content */}
            <p className='mb-6 text-sm text-gray-600 sm:text-base'>
              Are you sure you want to remove{' '}
              <span className='font-semibold text-gray-800'>"{itemToDelete.productName}"</span> from your cart?
            </p>

            {/* Actions */}
            <div className='flex gap-3'>
              <button
                onClick={closeDeleteModal}
                className='flex-1 cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:text-base'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 sm:text-base'
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
