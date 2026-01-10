import { ShoppingCart, User, Menu, X, UserCircle, Package, Calendar, LogOut, PawPrint } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '~/hooks/useCart';
import { useAppContext } from '~/contexts';
import { useMutation } from '@tanstack/react-query';
import authApi from '~/apis/auth.api';
import { clearUserInfoFromLocalStorage } from '~/utils/auth';

const Header = () => {
  const { isAuthenticated, profile } = useAppContext();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      clearUserInfoFromLocalStorage();
    } catch (error) {
      console.log('🚀 ~ handleLogout ~ error:', error);
    }
  };

  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between lg:h-20'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='group flex items-center gap-2'>
              <img
                src='/assets/images/logo.svg'
                alt='PetCareX Logo'
                className='h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-110'
              />
              <span className='text-xl font-bold text-gray-800 sm:text-2xl'>
                PetCare<span className='text-orange-500'>X</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className='hidden items-center space-x-6 lg:flex xl:space-x-8'>
            <Link
              to='/'
              className={`font-medium text-gray-700 transition-colors duration-200 hover:text-orange-500 ${pathname === '/' ? 'text-orange-500' : ''}`}
            >
              Products
            </Link>
            <Link
              to='/booking'
              className={`font-medium text-gray-700 transition-colors duration-200 hover:text-orange-500 ${pathname === '/booking' ? 'text-orange-500' : ''}`}
            >
              Book Appointment
            </Link>
            <Link
              to='/doctors'
              className={`font-medium text-gray-700 transition-colors duration-200 hover:text-orange-500 ${pathname === '/doctors' ? 'text-orange-500' : ''}`}
            >
              Doctor Schedule
            </Link>
          </nav>

          {/* Right Section: Cart & Account */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* Desktop: Dark rounded section */}
            <div className='hidden items-center gap-2 rounded-full bg-gray-800 p-2 sm:flex lg:gap-3'>
              {/* Cart */}
              <div className='group relative flex items-center gap-2'>
                <span className='hidden pl-2 text-sm font-semibold text-white lg:block'>Cart</span>
                <Link
                  to='/cart'
                  className='relative rounded-full transition-transform duration-200 hover:scale-105'
                  aria-label='Shopping Cart'
                >
                  <div className='rounded-full bg-orange-500 p-2 transition hover:bg-orange-600 lg:p-2.5'>
                    <ShoppingCart className='h-4 w-4 text-white lg:h-5 lg:w-5' />
                  </div>
                  <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white lg:h-5 lg:w-5'>
                    {cart.totalItems}
                  </span>
                </Link>

                {/* Cart Dropdown Preview */}
                {cart.totalItems > 0 && (
                  <div className='invisible absolute top-full right-0 mt-3 w-80 rounded-xl bg-white py-2 opacity-0 shadow-xl ring-1 ring-gray-200 transition-all duration-200 group-hover:visible group-hover:opacity-100'>
                    {/* Cart Items */}
                    <div className='max-h-96 overflow-y-auto'>
                      {cart.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.branchId}`}
                          className='flex gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50'
                        >
                          {/* Product Image */}
                          <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
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
                              <p className='line-clamp-2 text-sm font-medium text-gray-800'>{item.productName}</p>
                              <p className='mt-0.5 text-xs text-gray-500'>{item.branchName}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                              <span className='text-xs text-gray-600'>Qty: {item.quantity}</span>
                              <span className='text-sm font-semibold text-orange-600'>
                                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Summary */}
                    <div className='border-t border-gray-200 px-4 py-3'>
                      <div className='mb-2 flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>Total Items:</span>
                        <span className='font-semibold text-gray-800'>{cart.totalItems}</span>
                      </div>
                      <div className='mb-3 flex items-center justify-between'>
                        <span className='text-sm font-semibold text-gray-700'>Total Price:</span>
                        <span className='text-lg font-bold text-orange-600'>
                          {cart.totalPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <Link
                        to='/cart'
                        className='block w-full rounded-lg bg-orange-500 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-600'
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Account / Avatar */}
              {isAuthenticated ? (
                <>
                  <div className='h-6 w-px bg-gray-600 lg:h-8'></div>
                  <div className='group relative'>
                    <button
                      className='flex items-center gap-2 rounded-full transition-colors duration-200'
                      aria-label='Account'
                    >
                      <div className='flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-300 transition-transform duration-200 group-hover:scale-105 lg:h-8 lg:w-8'>
                        <User className='h-4 w-4 text-gray-600 lg:h-5 lg:w-5' />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    <div className='invisible absolute right-0 mt-3 w-64 rounded-xl bg-white py-2 opacity-0 shadow-xl ring-1 ring-gray-200 transition-all duration-200 group-hover:visible group-hover:opacity-100'>
                      {/* User Info Section */}
                      <div className='border-b border-gray-100 px-4 py-3'>
                        <p className='text-sm font-semibold text-gray-900'>{profile?.email?.split('@')?.[0]}</p>
                        <p className='mt-0.5 text-xs text-gray-500'>{profile?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className='py-2'>
                        <Link
                          to='/profile/personal-info'
                          className='group/item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600'
                        >
                          <UserCircle className='h-4 w-4 text-gray-400 group-hover/item:text-orange-500' />
                          <span>My Account</span>
                        </Link>
                        <Link
                          to='/profile/pets'
                          className='group/item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600'
                        >
                          <PawPrint className='h-4 w-4 text-gray-400 group-hover/item:text-orange-500' />
                          <span>My Pets</span>
                        </Link>
                        <Link
                          to='/profile/orders'
                          className='group/item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600'
                        >
                          <Package className='h-4 w-4 text-gray-400 group-hover/item:text-orange-500' />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to='/profile/medical-history'
                          className='group/item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600'
                        >
                          <Calendar className='h-4 w-4 text-gray-400 group-hover/item:text-orange-500' />
                          <span>Medical History</span>
                        </Link>
                      </div>

                      <hr className='my-2 border-gray-100' />

                      {/* Sign Out */}
                      <div className='py-1'>
                        <button
                          className='group/item flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50'
                          onClick={handleLogout}
                        >
                          <LogOut className='h-4 w-4' />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {/* Get Started Button - Only show when not authenticated */}
              {!isAuthenticated && (
                <>
                  <div className='hidden h-6 w-px bg-gray-600 lg:block lg:h-8'></div>
                  <Link
                    to='/register'
                    className='hidden rounded-full bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-yellow-500 hover:shadow-md lg:block xl:px-6 xl:py-3 xl:text-base'
                  >
                    Get Started For Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Simple icons */}
            <div className='flex items-center gap-3 sm:hidden'>
              <Link to='/cart' className='relative' aria-label='Shopping Cart'>
                <div className='rounded-full bg-orange-500 p-2 transition hover:bg-orange-600'>
                  <ShoppingCart className='h-5 w-5 text-white' />
                </div>
                <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white'>
                  {cart.totalItems}
                </span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden'
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? <X className='h-6 w-6 text-gray-700' /> : <Menu className='h-6 w-6 text-gray-700' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='border-t border-gray-200 bg-white shadow-lg lg:hidden'>
          <nav className='space-y-1 px-4 py-4'>
            <Link
              to='/products'
              className='block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-500'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to='/booking'
              className='block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-500'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Appointment
            </Link>
            <Link
              to='/doctors'
              className='block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-500'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Doctor Schedule
            </Link>

            <hr className='my-3 border-gray-200' />

            {/* Mobile Account Menu */}
            {isAuthenticated ? (
              <>
                <Link
                  to='/profile'
                  className='flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-500'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircle className='h-5 w-5' />
                  <span>My Account</span>
                </Link>
                <Link
                  to='/profile/orders'
                  className='flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-500'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className='h-5 w-5' />
                  <span>My Orders</span>
                </Link>
                <Link
                  to='/profile/medical-history'
                  className='flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-500'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className='h-5 w-5' />
                  <span>Medical History</span>
                </Link>

                <button
                  className='mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className='h-5 w-5' />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className='pt-3'>
                <Link
                  to='/register'
                  className='block w-full rounded-full bg-yellow-400 px-6 py-3 text-center text-base font-semibold text-gray-900 transition-all hover:bg-yellow-500'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started For Free
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
