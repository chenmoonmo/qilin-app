import { graphApi } from '@/constant';
import request from 'graphql-request';

export const graphFetcher = <T = unknown>(query: string) => request<T>(graphApi, query);
