// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
          <pi-part name="style"></pi-part>
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
          <pi-part name="script"></pi-part>
        </body>
      </html>
    )}
  />
));
