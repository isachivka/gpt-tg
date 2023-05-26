import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form';

import { endPoints } from '../../helpers/endPoints.ts';
import { useToken } from '../auth/TokenStorage.tsx';

type AddFormProps = {
  appendKey: (key: { token: string; id: number; comment: string }) => void;
};

export const AddForm = (props: AddFormProps) => {
  const { register, handleSubmit, reset } = useForm<{
    comment: string;
  }>();
  const { storage } = useToken();
  const { token } = storage;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const key = { ...data, token: nanoid(36) } as const;
      const response = await fetch(endPoints.addToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(key),
      });
      const json = await response.json();
      props.appendKey({ ...json, token: key.token });
      reset();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Comment:</span>
        <input type="text" id="comment" {...register('comment')} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
