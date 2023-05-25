import { useApi } from "../../helpers/useApi.ts";
import { Row } from "./Row.tsx";
import { AddForm } from "./AddForm.tsx";
import { useCallback } from "react";
import { endPoints } from "../../helpers/endPoints.ts";

export const Table = () => {
  const [keys, setKeys] = useApi<
    { telegramId: number; token: string; id: number }[]
  >(endPoints.keys);

  const appendKey = useCallback(
    (key: { telegramId: number; token: string; id: number }) => {
      if (keys) {
        setKeys([...keys, key]);
      }
    },
    [keys, setKeys]
  );

  if (!keys) {
    return null;
  }

  return (
    <>
      <table border={1} width="100%">
        <thead>
          <tr>
            <td>telegramId</td>
            <td>token</td>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <Row key={key.id} telegramId={key.telegramId} token={key.token} />
          ))}
        </tbody>
      </table>
      <br />
      <AddForm appendKey={appendKey} />
    </>
  );
};
