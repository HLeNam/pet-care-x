import { PawPrint } from 'lucide-react';
import { useState, type JSX } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
}

const ProfileLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      id: 'personal-info',
      label: 'Personal Info',
      path: '/profile/personal-info',
      icon: (
        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      )
    },
    {
      id: 'pet-management',
      label: 'Pet Management',
      path: '/profile/pets',
      icon: (
        <PawPrint className='h-5 w-5' />
      )
    },
    {
      id: 'order-history',
      label: 'Order History',
      path: '/profile/orders',
      icon: (
        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
          />
        </svg>
      )
    },
    {
      id: 'medical-history',
      label: 'Medical History',
      path: '/profile/medical-history',
      icon: (
        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      )
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <aside
        className={`fixed top-16 lg:top-20 left-0 z-40 bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
          } bottom-0 overflow-y-auto`}
      >
        <div className='flex h-16 items-center justify-between border-b px-4'>
          {isSidebarOpen && <h2 className='text-lg font-semibold text-gray-800'>Account</h2>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900'
            aria-label='Toggle sidebar'
          >
            {isSidebarOpen ? (
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            ) : (
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            )}
          </button>
        </div>

        <nav className='mt-6 space-y-1 px-3'>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${active ? 'bg-lime-50 text-lime-700' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <span className={active ? 'text-lime-600' : 'text-gray-500'}>{item.icon}</span>

                {isSidebarOpen && <span className='flex-1 truncate'>{item.label}</span>}

                {active && isSidebarOpen && <span className='h-2 w-2 rounded-full bg-lime-600'></span>}
              </Link>
            );
          })}
        </nav>

        <div className='absolute right-0 bottom-0 left-0 border-t bg-white p-4'>
          {isSidebarOpen ? (
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-700'>
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-900'>User Name</p>
                <Link to='/' className='text-xs text-gray-500 hover:text-gray-700'>
                  ← Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <Link to='/' className='flex justify-center' title='Back to Home'>
              <svg className='h-6 w-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
            </Link>
          )}
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className='sticky top-20 z-30 border-b bg-white px-6 py-4 shadow-sm'>
          <h1 className='text-2xl font-bold text-gray-800'>
            {menuItems.find((item) => isActive(item.path))?.label || 'Account'}
          </h1>
        </div>

        <div className='p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;
