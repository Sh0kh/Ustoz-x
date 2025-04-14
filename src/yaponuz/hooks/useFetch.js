import { useState, useEffect } from "react";
import { API_PATH } from "yaponuz/data/headers";
import { AUTH_TOKEN } from "yaponuz/data/headers";

const useFetch = (endpoint, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the full URL
        const url = `${API_PATH}${endpoint}`;

        // Get the token
        const token = localStorage.getItem(AUTH_TOKEN);

        // Standard headers
        const headers = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...options.headers,
        };

        // Request configuration
        const config = {
          method: method.toUpperCase(),
          headers: headers,
          ...options,
        };

        // Remove body for GET requests
        if (method.toUpperCase() === "GET") {
          delete config.body;
        } else if (options.body) {
          // Stringify the body if it's JSON
          config.body = JSON.stringify(options.body);
        }

        // Add URL parameters
        const fullUrl = options.params ? `${url}?${new URLSearchParams(options.params)}` : url;

        const response = await fetch(fullUrl, config);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, options]);

  return { data, loading, error };
};

export default useFetch;
