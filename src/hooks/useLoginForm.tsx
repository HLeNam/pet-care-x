import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '~/contexts';
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage, saveProfileToLocalStorage } from '~/utils/auth';
import { type LoginFormData, LoginFormSchema } from '~/types/auth.type';
import { ZodError } from 'zod';

interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: Partial<Record<keyof LoginFormData, string>>;
  isLoading: boolean;
  apiError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useAppContext();

  const [formData, setFormData] = useState<LoginFormData>({
    mobileOrEmail: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    try {
      LoginFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormData;
          if (path) {
            fieldErrors[path] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.mobileOrEmail,
          password: formData.password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();

      // Save auth data
      saveAccessTokenToLocalStorage(data.data.access_token);
      saveRefreshTokenToLocalStorage(data.data.refresh_token);
      saveProfileToLocalStorage(data.data.user);

      // Update context
      setIsAuthenticated(true);
      setProfile(data.data.user);

      // Navigate to home
      navigate('/');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    apiError,
    handleChange,
    handleCheckboxChange,
    handleSubmit
  };
};
