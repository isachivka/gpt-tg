import { useCallback } from 'react';

import { endPoints } from '../../helpers/endPoints.ts';
import { useToken } from '../auth/TokenStorage.tsx';

type RowProps = {
  id: number;
  token: string;
  comment: string;
  users: { userId: number }[];
  removeKey: (id: number) => void;
};

export const Row = (props: RowProps) => {
  const { storage } = useToken();
  const { token: authToken } = storage;
  const { token, comment, users, id, removeKey } = props;
  const onClickReject = useCallback(async () => {
    try {
      const response = await fetch(endPoints.rejectToken, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const json = await response.json();
      removeKey(id);
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  return (
    <tr>
      <td>
        <button onClick={onClickReject}>reject</button>
      </td>
      <td>
        <pre>{token || '********'}</pre>
      </td>
      <td>{comment}</td>
      <td>{users.map((user) => user.userId).join(', ')}</td>
    </tr>
  );
};
