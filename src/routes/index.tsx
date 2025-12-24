import { createBrowserRouter } from 'react-router-dom';

import type { AppRouteObject } from '~/types/route.type';
import guestRoutes from '~/routes/guest.routes';
import publicRoutes from '~/routes/public.routes';

const routes: AppRouteObject[] = [...publicRoutes, ...guestRoutes];

const router = createBrowserRouter(routes);

export default router;
