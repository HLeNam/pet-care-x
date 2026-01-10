import type { AppRouteObject } from '~/types/route.type';
import ManagerLayout from '~/layouts/ManagerLayout';
import Dashboard from '~/pages/Manager/pages/Dashboard';
import withManagerGuard from '~/components/ManagerGuard/WithManagerGuard';

const managerRoutes: AppRouteObject[] = [
  {
    path: '/manager',
    Component: withManagerGuard(ManagerLayout),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        index: true,
        element: <Dashboard />
      }
    ]
  }
];

export default managerRoutes;
