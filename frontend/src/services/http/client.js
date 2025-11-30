const getBaseUrl = () => {
  // 将来的に VITE_API_BASE_URL を参照する想定
  return import.meta.env.VITE_API_BASE_URL || 'https://example.invalid';
};

const fetchJson = async (path, options = {}) => {
  const fetcher = typeof globalThis !== 'undefined' && globalThis.fetch ? globalThis.fetch : null;
  if (!fetcher) {
    throw new Error('fetch is not available');
  }

  const res = await fetcher(`${getBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error('Request failed');
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
};

export { fetchJson };
