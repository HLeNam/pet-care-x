import { lazy } from 'react';
import MainLayout from '~/layouts/MainLayout';
import type { AppRouteObject } from '~/types/route.type';

const Home = lazy(() => import('~/pages/User/pages/Home'));
const ProductDetail = lazy(() => import('~/pages/User/pages/ProductDetail'));

const publicRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: '',
        index: true,
        Component: Home
      },
      {
        path: 'products/:id',
        Component: ProductDetail
      }
    ]
  }
];

export default publicRoutes;
