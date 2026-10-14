import { defineConfig } from "vite";
import { nitro } from "nitro/vite";

import { solidStart } from "@solidjs/start/config";

export default defineConfig({
  plugins: [
    solidStart({
      // renders the micro frontends into the HTML responses
      middleware: "src/middleware.ts",
    }),
    nitro(),
  ],
});
