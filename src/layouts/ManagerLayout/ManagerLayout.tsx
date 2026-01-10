import { Outlet, Link, useLocation } from 'react-router-dom';
import { BarChart3, LogOut } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import authApi from '~/apis/auth.api';
import { clearUserInfoFromLocalStorage } from '~/utils/auth';

const ManagerLayout = () => {
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

  const menuItems = [
    {
      path: '/manager/dashboard',
      label: 'Statistics & Reports',
      icon: BarChart3
    }
  ];

  return (
    <div className='flex min-h-screen flex-col bg-gray-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <Link to='/manager/dashboard' className='group flex items-center gap-2'>
              <img
                src='/assets/images/logo.svg'
                alt='PetCareX Logo'
                className='h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-110'
              />
              <span className='text-xl font-bold text-gray-800 sm:text-2xl'>
                PetCare<span className='text-orange-500'>X</span>
                <span className='ml-2 rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600'>
                  Manager
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden items-center space-x-1 md:flex'>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors duration-200 ${
                      isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className='h-5 w-5' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600'
              >
                <LogOut className='h-5 w-5' />
                <span>Logout</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <button
                onClick={handleLogout}
                className='flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-red-50 hover:text-red-600'
              >
                <LogOut className='h-5 w-5' />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className='flex space-x-1 overflow-x-auto pt-2 pb-3 md:hidden'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout;
