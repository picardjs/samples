import { initializePicard } from "picard-js/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

initializePicard({
  feed: "https://feed.piral.cloud/api/v1/microfrontends/picard-demos",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
