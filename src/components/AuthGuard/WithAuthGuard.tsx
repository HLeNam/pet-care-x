import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '~/contexts';

/**
 * HOC cho page chỉ dành cho user đã đăng nhập (auth guard).
 * Dùng được cho cả component thường và lazy, props kiểu nào cũng được.
 * @param Component - Component page cần bảo vệ
 * @param redirectTo - Đường dẫn sẽ chuyển hướng nếu chưa đăng nhập
 */
function withAuthGuard<P>(Component: React.ComponentType<P>, redirectTo: string = '/login') {
  const GuardedComponent: React.FC<React.PropsWithChildren<P>> = (props: React.PropsWithChildren<P>) => {
    const location = useLocation();
    const { isAuthenticated } = useAppContext();

    if (!isAuthenticated) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Component {...props} />;
  };
  GuardedComponent.displayName = `WithAuthGuard(${Component.displayName ?? Component.name ?? 'Component'})`;
  return GuardedComponent;
}

export default withAuthGuard;
