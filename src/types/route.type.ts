import type { ComponentType, PropsWithChildren } from 'react';
import type { ActionFunction, LoaderFunction, RouteObject, ShouldRevalidateFunction } from 'react-router-dom';

export type RouteComponentProps = PropsWithChildren<object>;

export type AppRouteObject = RouteObject & {
  Component?: ComponentType<RouteComponentProps>;
  ErrorBoundary?: ComponentType<RouteComponentProps>;
  children?: AppRouteObject[];
  loader?: LoaderFunction;
  action?: ActionFunction;
  shouldRevalidate?: ShouldRevalidateFunction;
};
