import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  // the files of the islands script resuming the micro frontends in the browser
  route("picard/:file", "routes/picard.$file.ts"),
] satisfies RouteConfig;
