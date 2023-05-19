import { graphApi } from '@/constant';
import request from 'graphql-request';

export const graphFetcher = (query: string) => request(graphApi, query);
