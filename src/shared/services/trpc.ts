import { type AppRouter } from '@/app-admin/routers';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import {
  createTRPCReact,
  httpLink,
  type inferReactQueryProcedureOptions,
} from '@trpc/react-query';
import { atom } from 'jotai';
import { QueryClient } from '@tanstack/react-query';

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();

export const trpcQueryClientAtom = atom(() => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        staleTime: 1000 * 10,
        refetchOnWindowFocus: true,
        retry: false,
      }
    },
  });
});

export const trpcClientAtom = atom(() =>
  trpc.createClient({ links: [httpLink({ url: 'http://127.0.0.1:9000/a/d/api/trpc/v1' })] })
);

