export * from './api';
export * from './contracts';
export * from './pairs';

export const NFTBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://projectstriper.xyz/'
    : 'http://localhost:3000';
