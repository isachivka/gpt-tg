import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TokenStorage } from "./features/auth/TokenStorage.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TokenStorage>
      <App />
    </TokenStorage>
  </React.StrictMode>
);
