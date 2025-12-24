import { lazy } from 'react';
import withGuestGuard from '~/components/GuestGuard/WithGuestGuard';
import type { AppRouteObject } from '~/types/route.type';

const AuthLayout = lazy(() => import('~/layouts/RegisterLayout'));
const Login = lazy(() => import('~/pages/Login'));
const Register = lazy(() => import('~/pages/Register'));

const guestRoutes: AppRouteObject[] = [
  {
    path: '/',
    Component: withGuestGuard(AuthLayout),
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  }
];

export default guestRoutes;
