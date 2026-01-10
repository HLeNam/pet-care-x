import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '~/contexts';
import { saveProfileToLocalStorage } from '~/utils/auth';
import { type RegisterFormData, RegisterFormSchema } from '~/types/auth.type';
import { ZodError } from 'zod';
import authApi from '~/apis/auth.api';
import type { AuthUser } from '~/types/user.type';

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: Partial<Record<keyof RegisterFormData, string>>;
  isLoading: boolean;
  apiError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export const useRegisterForm = (): UseRegisterFormReturn => {
  const navigate = useNavigate();
  const { setProfile } = useAppContext();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    try {
      RegisterFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof RegisterFormData;
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
      const response = await authApi.registerAccount({
        customerEmail: formData.email,
        customerName: formData.name,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });

      const data = response.data;

      if (!data) {
        setApiError('Registration failed: No data returned');
        return;
      }

      const user: AuthUser = {
        idAccount: data.account.idAccount,
        email: data.account.email,
        userId: data.idKhachHang,
        roles: ['ROLE_CUSTOMER']
      };

      saveProfileToLocalStorage(user);

      // Update context
      setProfile(user);
      // Navigate to home
      navigate('/login');
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Registration failed');
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
    handleSubmit
  };
};
