import { createBrowserRouter } from 'react-router-dom';

import type { AppRouteObject } from '~/types/route.type';
import guestRoutes from '~/routes/guest.routes';
import publicRoutes from '~/routes/public.routes';
import doctorRoutes from '~/routes/doctor.routes';
import managerRoutes from '~/routes/manager.routes';

const routes: AppRouteObject[] = [...publicRoutes, ...guestRoutes, ...doctorRoutes, ...managerRoutes];

const router = createBrowserRouter(routes);

export default router;
