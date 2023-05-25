import "./App.css";
import { Login } from "./features/auth/Login.tsx";
import { Logout } from "./features/auth/Logout.tsx";
import { useApi } from "./helpers/useApi.ts";
import { Table } from "./features/keys/Table.tsx";
import { endPoints } from "./helpers/endPoints.ts";

function App() {
  const [healthCheckResult] = useApi(endPoints.health);
  console.log(healthCheckResult);

  return (
    <>
      <Login />
      <Logout />
      <br />
      <br />
      <Table />
    </>
  );
}

export default App;
