import { useEffect, useState } from 'react';
import { AppContext, INITIAL_APP_STATE } from '~/contexts/app/app.context';
import { CartProvider } from '~/contexts/cart';
import type { UserProfile } from '~/types/user.type';
import { LocalStorageEventTarget } from '~/utils/auth';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(INITIAL_APP_STATE.isAuthenticated);
  const [profile, setProfile] = useState<UserProfile | null>(INITIAL_APP_STATE.profile);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('userInfoCleared', resetAppState);

    return () => {
      LocalStorageEventTarget.removeEventListener('userInfoCleared', resetAppState);
    };
  }, []);

  const resetAppState = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      <CartProvider>{children}</CartProvider>
    </AppContext.Provider>
  );
};
