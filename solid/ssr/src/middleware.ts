import { createMiddleware } from "@solidjs/start/middleware";
import { picard } from "./picard";

export default createMiddleware([
  async (event, next) => {
    const response = await next();

    // pages set the content type on the event and return the (streamed) body
    if (event.res.headers.get("content-type")?.startsWith("text/html") && response instanceof Object && "body" in response) {
      const html = await new Response(response.body as BodyInit).text();
      event.res.headers.delete("content-length");
      // renders the micro frontends into the pi-* elements of the page
      return picard.decorate(html);
    }

    return response;
  },
]);
