export const fetcher = <T = any>(
  url: string,
  options: Parameters<typeof fetch>[1]
): Promise<T> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN_ENV === 'production'
      ? 'https://api.example.com'
      : '/request';
  return fetch(`${baseUrl}${url}`, options).then(res => res.json());
};
