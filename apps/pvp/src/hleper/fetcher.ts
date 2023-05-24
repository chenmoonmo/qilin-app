import request from 'graphql-request';

import { graphApi } from '@/constant';

export const graphFetcher = <T = unknown>(query: string) => request<T>(graphApi, query);
