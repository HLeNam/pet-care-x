import { useAppContext } from '~/contexts';

const PersonalInfo = () => {
  const { profile } = useAppContext();

  return (
    <div className='mx-auto max-w-4xl'>
      <div className='rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-6 text-xl font-semibold text-gray-800'>Personal Information</h2>

        {/* Form */}
        <form className='space-y-6'>
          <div className='flex items-center gap-6'>
            <div className='flex h-24 w-24 items-center justify-center rounded-full bg-lime-100 text-lime-700'>
              <svg className='h-12 w-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
            <div>
              <button
                type='button'
                className='rounded-lg bg-lime-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lime-700'
              >
                Change Avatar
              </button>
              <p className='mt-1 text-xs text-gray-500'>JPG, PNG. Max 2MB</p>
            </div>
          </div>

          {/* Two columns layout */}
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label htmlFor='name' className='mb-2 block text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                defaultValue={profile?.name || ''}
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-lime-600 focus:bg-white focus:ring-2 focus:ring-lime-600/20 focus:outline-none'
                placeholder='Enter full name'
              />
            </div>

            <div>
              <label htmlFor='email' className='mb-2 block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                id='email'
                defaultValue={profile?.email || ''}
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-lime-600 focus:bg-white focus:ring-2 focus:ring-lime-600/20 focus:outline-none'
                placeholder='email@example.com'
              />
            </div>

            <div>
              <label htmlFor='phone' className='mb-2 block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <input
                type='tel'
                id='phone'
                defaultValue={profile?.phone || ''}
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-lime-600 focus:bg-white focus:ring-2 focus:ring-lime-600/20 focus:outline-none'
                placeholder='0123456789'
              />
            </div>

            <div>
              <label htmlFor='dob' className='mb-2 block text-sm font-medium text-gray-700'>
                Date of Birth
              </label>
              <input
                type='date'
                id='dob'
                defaultValue={profile?.date_of_birth || ''}
                className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-lime-600 focus:bg-white focus:ring-2 focus:ring-lime-600/20 focus:outline-none'
              />
            </div>
          </div>

          <div>
            <label htmlFor='address' className='mb-2 block text-sm font-medium text-gray-700'>
              Address
            </label>
            <textarea
              id='address'
              rows={3}
              defaultValue={profile?.address || ''}
              className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-lime-600 focus:bg-white focus:ring-2 focus:ring-lime-600/20 focus:outline-none'
              placeholder='Enter full address'
            />
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              className='rounded-lg bg-lime-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700'
            >
              Save Changes
            </button>
            <button
              type='button'
              className='rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
