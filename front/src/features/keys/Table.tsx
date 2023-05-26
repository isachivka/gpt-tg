import { useCallback } from 'react';

import { endPoints } from '../../helpers/endPoints.ts';
import { useApi } from '../../helpers/useApi.ts';
import { AddForm } from './AddForm.tsx';
import { Row } from './Row.tsx';

type Key = {
  token: string;
  id: number;
  comment: string;
};

type KeyWithUser = Key & {
  users: { userId: number }[];
};

export const Table = () => {
  const [keys, setKeys] = useApi<KeyWithUser[]>(endPoints.keys);

  const appendKey = useCallback(
    (key: Key) => {
      if (keys) {
        setKeys([{ ...key, users: [] }, ...keys]);
      }
    },
    [keys, setKeys]
  );

  const removeKey = useCallback(
    (id: number) => {
      if (keys) {
        setKeys([...keys.filter((key) => key.id !== id)]);
      }
    },
    [keys, setKeys]
  );

  if (!keys) {
    return null;
  }

  return (
    <>
      <AddForm appendKey={appendKey} />
      <br />
      <table border={0} width="100%">
        <thead>
          <tr>
            <td></td>
            <td>token</td>
            <td>comment</td>
            <td>users</td>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <Row
              id={key.id}
              key={key.id}
              comment={key.comment}
              users={key.users}
              token={key.token}
              removeKey={removeKey}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
