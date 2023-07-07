export const fetcher = <T = any>(
  url: string,
  options: Parameters<typeof fetch>[1]
): Promise<T> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN_ENV === 'production'
      ? 'https://api.example.com'
      : '/request';
  return fetch(`${baseUrl}${url}`, options).then(async res => {
    const data = await res.json();
    if (data.errCode === 200) {
      return data;
    }
    throw new Error(data.errCode, { cause: data.errMsg });
  });
};
