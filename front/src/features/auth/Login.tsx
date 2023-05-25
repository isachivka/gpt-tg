import { useToken } from "./TokenStorage.tsx";
import { MouseEventHandler, useCallback, useRef } from "react";

export const Login = () => {
  const { storage, setToken } = useToken();
  const inputRef = useRef<HTMLInputElement>(null);

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (inputRef.current) {
        setToken(inputRef.current.value);
      }
    },
    [setToken, inputRef]
  );

  if (storage.token) return null;

  return (
    <form>
      <input hidden type="text" name="username" autoComplete="username" />
      <input
        autoComplete="new-password"
        ref={inputRef}
        name="ACCESS_KEY"
        type="password"
      />
      <button onClick={onClick}>Set ACCESS_KEY</button>
    </form>
  );
};
