import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '~/contexts';
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage, saveProfileToLocalStorage } from '~/utils/auth';
import { type LoginFormData, LoginFormSchema } from '~/types/auth.type';
import { ZodError } from 'zod';
import authApi from '~/apis/auth.api';
import type { AuthUser } from '~/types/user.type';

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
  const { setIsAuthenticated, setProfile, profile } = useAppContext();

  const [formData, setFormData] = useState<LoginFormData>({
    email: profile?.email || '',
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
      const response = await authApi.loginAccount({
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      if (!data) {
        setApiError('Login failed: No data returned');
        return;
      }

      // Save auth data
      saveAccessTokenToLocalStorage(data.accessToken);
      saveRefreshTokenToLocalStorage('');

      const user: AuthUser = {
        email: data.email,
        idAccount: data.idAccount,
        userId: data.userId
      };

      saveProfileToLocalStorage(user);

      // Update context
      setIsAuthenticated(true);
      setProfile(user);
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
