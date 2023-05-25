type RowProps = {
  telegramId: number;
  token: string;
};
export const Row = (props: RowProps) => {
  return (
    <tr>
      <td>{props.telegramId}</td>
      <td>{props.token}</td>
    </tr>
  );
};
