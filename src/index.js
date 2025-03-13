import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot
import App from "./App";

// Use createRoot instead of ReactDOM.render
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);