import { MetaProvider, Title } from "@solidjs/meta";
import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Picard.js with SolidStart</Title>
          <nav class="nav justify-content-center my-3">
            <A class="nav-link" href="/">Home</A>
            <A class="nav-link" href="/about">About</A>
          </nav>
          <div class="container">
            <Suspense>{props.children}</Suspense>
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
