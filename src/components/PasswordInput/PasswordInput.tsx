import { useState } from 'react';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  label: string;
}

export const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  label
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='text-sm font-medium text-gray-800'>
        {label}
      </label>
      <div className='relative flex items-center'>
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`flex-1 rounded-lg border bg-gray-50 px-4 py-3.5 pr-12 text-sm transition-all focus:border-lime-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(124,179,66,0.1)] focus:outline-none ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300'
          } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type='button'
          className='absolute right-3 flex items-center justify-center p-2 text-gray-400 transition-colors hover:text-gray-600'
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <path
                d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <line x1='1' y1='1' x2='23' y2='23' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          ) : (
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <path
                d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <circle cx='12' cy='12' r='3' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          )}
        </button>
      </div>
      {error && <span className='mt-0.5 text-xs text-red-500'>{error}</span>}
    </div>
  );
};
