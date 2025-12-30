import { Link } from 'react-router-dom';
import { useAppContext } from '~/contexts';

const Home = () => {
  const { profile } = useAppContext();

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='mx-auto max-w-4xl px-4'>
        {/* Welcome Section */}
        <div className='rounded-lg bg-white p-8 shadow-md'>
          <h1 className='mb-2 text-3xl font-bold text-gray-800'>Hello, {profile?.name || 'Customer'}!</h1>
          <p className='text-gray-600'>Welcome to Pet Care X</p>

          <div className='mt-8 grid gap-4 md:grid-cols-2'>
            {/* Personal Info Card */}
            <Link
              to='/profile/personal-info'
              className='group rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-lime-600 hover:shadow-md'
            >
              <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 text-lime-600 transition-colors group-hover:bg-lime-600 group-hover:text-white'>
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <h3 className='mb-1 text-lg font-semibold text-gray-800'>Your Personal Info</h3>
              <p className='text-sm text-gray-600'>Manage your account information</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
