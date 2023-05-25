import { useToken } from "./TokenStorage.tsx";
import { useCallback } from "react";

export const Logout = () => {
  const { storage, setToken } = useToken();

  const onClick = useCallback(() => {
    setToken("");
  }, [setToken]);

  if (!storage.token) return null;

  return <button onClick={onClick}>logout</button>;
};
