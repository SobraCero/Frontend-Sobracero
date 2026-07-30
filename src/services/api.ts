export const BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('token');

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiFetch = async <T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
  const { requireAuth = true, headers, ...rest } = options;
  
  const defaultHeaders: Record<string, string> = {};
  
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const finalHeaders = { ...defaultHeaders, ...(headers as Record<string, string>) };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: finalHeaders,
      ...rest,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || errorData?.message || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null as unknown as T;
    
    const data = await response.json().catch(() => null);
    return data as T;
  } catch (error) {
    throw error;
  }
};