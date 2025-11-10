const handleResponse = async (response) => {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }
  let message = 'Request failed';
  try {
    const data = await response.json();
    message = data?.error || message;
  } catch (error) {
    // ignore
  }
  const error = new Error(message);
  error.status = response.status;
  throw error;
};

export const apiClient = {
  get: async (path, params) => {
    const url = new URL(path, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value);
        }
      });
    }
    const response = await fetch(url.toString());
    return handleResponse(response);
  },
  post: async (path, body) => {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },
  put: async (path, body) => {
    const response = await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },
  delete: async (path) => {
    const response = await fetch(path, { method: 'DELETE' });
    return handleResponse(response);
  }
};
