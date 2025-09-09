export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});

  // Add Authorization header if not already present
  if (!headers.has('Authorization')) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const finalInit: RequestInit = {
    ...init,
    headers,
  };

  const response = await fetch(input, finalInit);

  if (response.status === 401) {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('localStorageChange'));
    } finally {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  return response;
}


