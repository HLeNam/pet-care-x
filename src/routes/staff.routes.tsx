import { Navigate } from 'react-router-dom';
import StaffLayout from '~/layouts/StaffLayout';
import PetLookup from '~/pages/Staff/pages/PetLookup';
import CreateAppointment from '~/pages/Staff/pages/CreateAppointment';
import type { AppRouteObject } from '~/types/route.type';
import withStaffGuard from '~/components/StaffGuard/WithStaffGuard';

const staffRoutes: AppRouteObject[] = [
  {
    path: '/staff',
    Component: withStaffGuard(StaffLayout),
    children: [
      {
        index: true,
        element: <Navigate to='/staff/pet-lookup' replace />
      },
      {
        path: 'pet-lookup',
        element: <PetLookup />
      },
      {
        path: 'create-appointment',
        element: <CreateAppointment />
      }
    ]
  }
];

export default staffRoutes;
