import { RouteObject } from 'react-router-dom';
import ManagerLayout from '~/layouts/ManagerLayout';
import Dashboard from '~/pages/Manager/pages/Dashboard';

const managerRoutes: RouteObject[] = [
  {
    path: '/manager',
    element: <ManagerLayout />,
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
