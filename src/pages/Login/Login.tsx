import { Link } from 'react-router-dom';
import { useLoginForm } from '~/hooks/useLoginForm';
import { PasswordInput } from '~/components/PasswordInput';
import { SocialLoginButtons } from '~/components/SocialLoginButtons';

const Login = () => {
  const { formData, errors, isLoading, apiError, handleChange, handleCheckboxChange, handleSubmit } = useLoginForm();

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-5'>
      <div className='flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex-row'>
        <div className='flex flex-1 flex-col justify-center p-12 lg:p-16'>
          <h1 className='mb-8 text-5xl font-bold text-lime-600'>Login</h1>

          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {apiError && (
              <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                {apiError}
              </div>
            )}

            <div className='flex flex-col gap-2'>
              <label htmlFor='mobileOrEmail' className='text-sm font-medium text-gray-700'>
                Mobile Number / Email
              </label>

              <input
                type='text'
                id='mobileOrEmail'
                name='mobileOrEmail'
                value={formData.mobileOrEmail}
                onChange={handleChange}
                className={`rounded-lg border bg-gray-50 px-4 py-3.5 text-sm transition-all focus:border-lime-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(132,204,22,0.1)] focus:outline-none ${
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
              className='mt-2 w-full rounded-full bg-lime-600 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-700 hover:shadow-[0_6px_20px_rgba(132,204,22,0.4)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-60'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>

            <div className='mt-4'>
              <p className='mb-4 text-center text-xs text-gray-400'>OR CONTINUE WITH</p>
              <SocialLoginButtons onSocialLogin={handleSocialLogin} disabled={isLoading} />
            </div>
          </form>
        </div>

        <div className='flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-lime-50 to-green-50 p-12 text-center lg:p-16'>
          <div className='max-w-md'>
            <h2 className='mb-4 text-2xl font-bold text-gray-800'>Don't have an account?</h2>

            <p className='mb-6 leading-relaxed text-gray-600'>
              In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the
              visual form of a document or a typeface without relying on meaningful content.
            </p>

            <Link
              to='/register'
              className='inline-block rounded-full border-2 border-orange-500 bg-transparent px-10 py-3 text-sm font-semibold text-orange-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white hover:shadow-[0_4px_12px_rgba(255,107,53,0.3)]'
            >
              Registration
            </Link>

            <img
              src='/assets/images/single_dog.png'
              alt='Cute dog'
              className='mx-auto mt-8 h-auto w-full max-w-xs'
              onError={(e) => {
                // Fallback image nếu file không tồn tại
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
