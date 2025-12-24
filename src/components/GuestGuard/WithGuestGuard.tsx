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
    const { isAuthenticated } = useAppContext();

    if (isAuthenticated) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Component {...props} />;
  };
  GuardedComponent.displayName = `WithGuestGuard(${Component.displayName ?? Component.name ?? 'Component'})`;
  return GuardedComponent;
}

export default withGuestGuard;
