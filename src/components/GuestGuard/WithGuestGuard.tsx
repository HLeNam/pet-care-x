import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '~/contexts';

/**
 * HOC cho page chỉ dành cho guest (chưa đăng nhập).
 * Dùng được cho cả component thường và lazy, props kiểu nào cũng được.
 * @param Component - Component page cần bảo vệ
 * @param redirectTo - Đường dẫn chuyển hướng khi đã đăng nhập
 */
function withGuestGuard<P>(Component: React.ComponentType<P>, redirectTo: string = '/') {
  const GuardedComponent: React.FC<React.PropsWithChildren<P>> = (props: React.PropsWithChildren<P>) => {
    const location = useLocation();
    const { isAuthenticated, profile } = useAppContext();

    const isCustomer = profile?.roles?.includes('ROLE_CUSTOMER');

    const isAdmin = profile?.roles?.includes('ROLE_ADMIN');

    const isDoctor = profile?.roles?.includes('ROLE_DOCTOR') || isAdmin;

    const isManager = profile?.roles?.includes('ROLE_MANAGER') || isAdmin;

    const isStaff =
      profile?.roles?.includes('ROLE_STAFF') ||
      isManager ||
      isDoctor ||
      profile?.roles?.includes('ROLE_RECEPTIONIST') ||
      isAdmin;

    if (isAuthenticated && isCustomer) {
      return <Navigate to='/' state={{ from: location }} replace />;
    }

    if (isAuthenticated && isManager) {
      return <Navigate to='/manager' state={{ from: location }} replace />;
    }

    if (isAuthenticated && isDoctor) {
      return <Navigate to='/doctor' state={{ from: location }} replace />;
    }

    if (isAuthenticated && isStaff) {
      return <Navigate to='/staff' state={{ from: location }} replace />;
    }

    if (isAuthenticated) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Component {...props} />;
  };
  GuardedComponent.displayName = `WithGuestGuard(${Component.displayName ?? Component.name ?? 'Component'})`;
  return GuardedComponent;
}

export default withGuestGuard;
