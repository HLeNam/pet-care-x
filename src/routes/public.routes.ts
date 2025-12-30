import { lazy } from 'react';
import MainLayout from '~/layouts/MainLayout';
import ProfileLayout from '~/layouts/ProfileLayout';
import type { AppRouteObject } from '~/types/route.type';

const Home = lazy(() => import('~/pages/User/pages/Home'));
const PersonalInfo = lazy(() => import('~/pages/User/pages/Profile/PersonalInfo'));
const PetManagement = lazy(() => import('~/pages/User/pages/Profile/PetManagement'));
const OrderHistory = lazy(() => import('~/pages/User/pages/Profile/OrderHistory'));
const MedicalHistory = lazy(() => import('~/pages/User/pages/Profile/MedicalHistory'));

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
        path: 'profile',
        Component: ProfileLayout,
        children: [
          {
            path: 'personal-info',
            Component: PersonalInfo
          },
          {
            path: 'pets',
            Component: PetManagement
          },
          {
            path: 'orders',
            Component: OrderHistory
          },
          {
            path: 'medical-history',
            Component: MedicalHistory
          }
        ]
      }
    ]
  }
];

export default publicRoutes;
