import { useToken } from "../features/auth/TokenStorage.tsx";
import { useEffect, useState } from "react";

const emptyInit = {};

export const useApi = <T>(
  endPoint: RequestInfo | URL,
  init: RequestInit = emptyInit
) => {
  const [response, setResponse] = useState<T | null>(null);
  const { storage } = useToken();
  const { token } = storage;

  useEffect(() => {
    fetch(endPoint, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Health check failed: " +
              JSON.stringify({
                status: res.status,
                statusText: res.statusText,
              })
          );
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
      })
      .then((res) => {
        setResponse(res);
      });
  }, [token, endPoint, init]);

  return [response, setResponse] as const;
};
