import { useForm } from "react-hook-form";
import { useToken } from "../auth/TokenStorage.tsx";
import { endPoints } from "../../helpers/endPoints.ts";

type AddFormProps = {
  appendKey: (key: { telegramId: number; token: string; id: number }) => void;
};

export const AddForm = (props: AddFormProps) => {
  const { register, handleSubmit, reset } = useForm<{
    telegramId: number;
    token: string;
  }>();
  const { storage } = useToken();
  const { token } = storage;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch(endPoints.addToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      props.appendKey(json);
      reset();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="telegramId">Telegram ID:</label>
      <input type="number" id="telegramId" {...register("telegramId")} />

      <label htmlFor="token">Token:</label>
      <input type="text" id="token" {...register("token")} />

      <button type="submit">Submit</button>
    </form>
  );
};
