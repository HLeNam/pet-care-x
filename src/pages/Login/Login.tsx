import { Link } from 'react-router-dom';
import { useLoginForm } from '~/hooks/useLoginForm';
import { PasswordInput } from '~/components/PasswordInput';

const Login = () => {
  const { formData, errors, isLoading, apiError, handleChange, handleCheckboxChange, handleSubmit } = useLoginForm();

  return (
    <div className='flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4'>
      <div className='flex h-full max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex-row'>
        {/* Left Section - Form */}
        <div className='flex flex-1 flex-col justify-center p-8 lg:p-12'>
          <h1 className='mb-6 text-4xl font-bold text-lime-600 lg:text-5xl'>Login</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {apiError && (
              <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700'>
                {apiError}
              </div>
            )}

            <div className='flex flex-col gap-1.5'>
              <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='text'
                id='email'
                name='email'
                value={formData.mobileOrEmail}
                onChange={handleChange}
                className={`rounded-lg border bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-lime-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(132,204,22,0.1)] focus:outline-none ${
                  errors.mobileOrEmail ? 'border-red-400 bg-red-50' : 'border-gray-300'
                } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60`}
                placeholder='Enter your email'
                disabled={isLoading}
              />
              {errors.mobileOrEmail && <span className='text-xs text-red-500'>{errors.mobileOrEmail}</span>}
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

            <div className='flex items-center justify-between'>
              <label className='flex cursor-pointer items-center gap-2 text-sm text-gray-600'>
                <input
                  type='checkbox'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleCheckboxChange}
                  className='cursor-pointer'
                  disabled={isLoading}
                />
                Remember password
              </label>
              <Link
                to='/forgot-password'
                className='text-sm text-lime-600 transition-colors hover:text-lime-700 hover:underline'
              >
                Forgot password?
              </Link>
            </div>

            <button
              type='submit'
              className='mt-1 w-full rounded-full bg-lime-600 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-700 hover:shadow-[0_6px_20px_rgba(132,204,22,0.4)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Right Section - Welcome */}
        <div className='flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-lime-50 to-green-50 p-8 text-center lg:p-12'>
          <div className='max-w-md'>
            <h2 className='mb-3 text-xl font-bold text-gray-800 lg:text-2xl'>Don't have an account?</h2>
            <p className='mb-5 text-sm leading-relaxed text-gray-600'>
              In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the
              visual form of a document or a typeface without relying on meaningful content.
            </p>
            <Link
              to='/register'
              className='inline-block rounded-full border-2 border-orange-500 bg-transparent px-8 py-2.5 text-sm font-semibold text-orange-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_4px_12px_rgba(255,107,53,0.3)]'
            >
              Registration
            </Link>
            <img
              src='/assets/images/single_dog.png'
              alt='Cute dog'
              className='mx-auto mt-6 h-auto w-full max-w-[200px] lg:max-w-xs'
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Eb2cgSW1hZ2U8L3RleHQ+PC9zdmc+';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
