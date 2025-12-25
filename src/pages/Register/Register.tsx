import { Link } from 'react-router-dom';
import { useRegisterForm } from '~/hooks/useRegisterForm';
import { PasswordInput } from '~/components/PasswordInput';
import { SocialLoginButtons } from '~/components/SocialLoginButtons';

const Register = () => {
  const { formData, errors, isLoading, apiError, handleChange, handleSubmit } = useRegisterForm();

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-white p-5'>
      <div className='flex min-h-[600px] w-full max-w-[1400px] overflow-hidden rounded-[20px] bg-gray-50 shadow-[0_20px_60px_rgba(0,0,0,0.1)]'>
        {/* Left Section - Welcome */}
        <div className='relative flex flex-1 flex-col justify-between bg-gradient-to-br from-white to-gray-100 p-12 lg:p-16'>
          <div className='flex h-full flex-col'>
            <h1 className='mb-10 text-5xl leading-tight font-light text-gray-800'>
              Welcome to
              <br />
              <span className='block font-bold text-orange-500'>Pet Care</span>
              <span className='block font-normal text-lime-600'>Solutions</span>
            </h1>

            <div className='mb-10'>
              <p className='mb-3 text-sm text-gray-600'>Do you have an account?</p>
              <Link
                to='/login'
                className='inline-block rounded-full border-2 border-orange-500 bg-transparent px-10 py-3 text-sm font-semibold text-orange-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_4px_12px_rgba(255,107,53,0.3)]'
              >
                Login
              </Link>
            </div>

            <div className='mt-auto text-center'>
              <img
                src='/assets/images/pets.png'
                alt='Three white puppies'
                className='mx-auto h-auto max-h-[300px] max-w-full object-contain'
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QZXQgSW1hZ2U8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className='flex flex-1 items-center justify-center bg-white p-12 lg:p-16'>
          <div className='w-full max-w-[450px]'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='name' className='text-sm font-medium text-gray-800'>
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className={`rounded-lg border bg-gray-50 px-4 py-3.5 text-sm transition-all focus:border-lime-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(124,179,66,0.1)] focus:outline-none ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60`}
                  placeholder='Enter your name'
                  disabled={isLoading}
                />
                {errors.name && <span className='mt-0.5 text-xs text-red-500'>{errors.name}</span>}
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor='mobileOrEmail' className='text-sm font-medium text-gray-800'>
                  Mobile Number / Email
                </label>
                <input
                  type='text'
                  id='mobileOrEmail'
                  name='mobileOrEmail'
                  value={formData.mobileOrEmail}
                  onChange={handleChange}
                  className={`rounded-lg border bg-gray-50 px-4 py-3.5 text-sm transition-all focus:border-lime-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(124,179,66,0.1)] focus:outline-none ${
                    errors.mobileOrEmail ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60`}
                  placeholder='Enter mobile number or email'
                  disabled={isLoading}
                />
                {errors.mobileOrEmail && <span className='mt-0.5 text-xs text-red-500'>{errors.mobileOrEmail}</span>}
              </div>

              <PasswordInput
                id='password'
                name='password'
                label='Password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter password'
                error={errors.password}
                disabled={isLoading}
              />

              <PasswordInput
                id='confirmPassword'
                name='confirmPassword'
                label='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='Confirm password'
                error={errors.confirmPassword}
                disabled={isLoading}
              />

              {apiError && (
                <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                  {apiError}
                </div>
              )}

              <button
                type='submit'
                className='mt-2 rounded-full bg-lime-600 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-700 hover:shadow-[0_6px_20px_rgba(124,179,66,0.4)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60'
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Registration'}
              </button>

              <SocialLoginButtons onSocialLogin={handleSocialLogin} disabled={isLoading} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
