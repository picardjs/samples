import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import { PicardHtml } from "./components/picard";
import { picard } from "./picard.server";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" },
];

export function loader() {
  return {
    // the styles of Picard.js are needed before the micro frontends are shown
    style: picard.decorate('<pi-part name="style"></pi-part>'),
    // the state and the islands script - streamed, as it waits for the feed
    script: picard.decorate('<pi-part name="script"></pi-part>'),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* style and link elements are allowed in the body, too */}
        {data && <PicardHtml html={data.style} />}
        <nav className="nav justify-content-center my-3">
          <NavLink className="nav-link" to="/">Home</NavLink>
          <NavLink className="nav-link" to="/about">About</NavLink>
        </nav>
        <div className="container">{children}</div>
        <ScrollRestoration />
        <Scripts />
        {data && <PicardHtml html={data.script} />}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
