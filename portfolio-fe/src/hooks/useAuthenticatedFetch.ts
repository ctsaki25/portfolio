import { useAuth0 } from "@auth0/auth0-react";

export const useAuthenticatedFetch = () => {
  const { getAccessTokenSilently } = useAuth0();

  const authFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
      const token = await getAccessTokenSilently();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Authenticated fetch error:", error);
      throw error;
    }
  };

  return authFetch;
}; 