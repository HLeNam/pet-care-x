import { createContext, useContext } from 'react';
import type { AuthUser } from '~/types/user.type';
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '~/utils/auth';

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  profile: AuthUser | null;
  setProfile: (profile: AuthUser | null) => void;
}

export const INITIAL_APP_STATE: AppContextInterface = {
  isAuthenticated: getAccessTokenFromLocalStorage() !== null,
  setIsAuthenticated: () => {},
  profile: getProfileFromLocalStorage(),
  setProfile: () => {}
};

export const AppContext = createContext<AppContextInterface>(INITIAL_APP_STATE);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
