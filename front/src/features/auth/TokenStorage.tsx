import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type Storage = {};

const TokenContext = createContext<{
  storage: { token?: string };
  setToken: (token: string) => void;
} | null>(null);

export const useToken = () => {
  const storage = useContext(TokenContext);
  if (!storage) throw new Error("You must decorate app into TokenStorage");
  return storage;
};

export const TokenStorage = (props: { children: ReactNode }) => {
  const [storage, setStorage] = useState<Storage>({
    token: undefined,
  });
  const setToken = useCallback(
    (token: string) => {
      setStorage({
        ...storage,
        token,
      });
    },
    [setStorage, storage]
  );
  return (
    <TokenContext.Provider value={{ storage, setToken }}>
      {props.children}
    </TokenContext.Provider>
  );
};
