import { createBrowserRouter } from 'react-router-dom';

import type { AppRouteObject } from '~/types/route.type';
import guestRoutes from '~/routes/guest.routes';
import publicRoutes from '~/routes/public.routes';
import doctorRoutes from '~/routes/doctor.routes';

const routes: AppRouteObject[] = [...publicRoutes, ...guestRoutes, ...doctorRoutes];

const router = createBrowserRouter(routes);

export default router;
