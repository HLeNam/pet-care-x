import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import DoctorLayout from '~/layouts/DoctorLayout';
import type { AppRouteObject } from '~/types/route.type';

const Appointments = lazy(() => import('~/pages/Doctor/pages/Appointments'));
const MedicineSearch = lazy(() => import('~/pages/Doctor/pages/MedicineSearch'));
const PetRecords = lazy(() => import('~/pages/Doctor/pages/PetRecords'));
const MedicalHistory = lazy(() => import('~/pages/Doctor/pages/MedicalHistory'));

const doctorRoutes: AppRouteObject[] = [
  {
    path: '/doctor',
    Component: DoctorLayout,
    children: [
      {
        path: '',
        index: true,
        element: <Navigate to='/doctor/appointments' replace />
      },
      {
        path: 'appointments',
        Component: Appointments
      },
      {
        path: 'medicine-search',
        Component: MedicineSearch
      },
      {
        path: 'pet-records',
        Component: PetRecords
      },
      {
        path: 'medical-history',
        Component: MedicalHistory
      }
    ]
  }
];

export default doctorRoutes;
