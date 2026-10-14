# Picard.js with ASP.NET Core (SSR)

An ASP.NET Core application (Razor Pages, .NET 10) that renders micro frontends on the server and resumes them in the browser, even though the backend isn't written in JavaScript.

## What Picard.js Does Here

Micro frontends are JavaScript, so rendering them on the server needs a JavaScript runtime. Instead of embedding one into .NET, the sample runs Picard.js as a small **decorator service** next to the application:

```
Browser ──► ASP.NET Core ──(HTML)──► decorator service (Node.js, picard-js/node)
        ◄── decorated HTML ◄───────┘
```

1. Razor renders the page as usual, with `pi-component` and `pi-part` elements in it.
2. A middleware posts the HTML to the decorator service, which renders the micro frontends into it and returns the result.
3. In the browser, the islands script (proxied through ASP.NET Core) hydrates `pi-ssr-html` and renders the client-only micro frontends of the demo feed (`server="none"`).

The decorator service is [`shared/picard-decorator`](../../shared/picard-decorator/). The [htmx](../../htmx/ssr/) sample (Python) uses it too.

## How It Is Integrated

**1. The middleware.** [`App/PicardMiddleware.cs`](./App/PicardMiddleware.cs) buffers each HTML response and sends it to the decorator service:

```csharp
var original = context.Response.Body;
using var buffer = new MemoryStream();
context.Response.Body = buffer;

try
{
    await next(context);
}
finally
{
    context.Response.Body = original;
}

buffer.Position = 0;

if (context.Response.ContentType?.StartsWith("text/html") == true)
{
    var html = await new StreamReader(buffer, Encoding.UTF8).ReadToEndAsync(context.RequestAborted);
    using var content = new StringContent(html, Encoding.UTF8, "text/html");
    using var response = await client.PostAsync("decorate", content, context.RequestAborted);
    response.EnsureSuccessStatusCode();
    var result = await response.Content.ReadAsByteArrayAsync(context.RequestAborted);
    context.Response.ContentLength = result.Length;
    await original.WriteAsync(result, context.RequestAborted);
}
```

Requests to `/picard/*` are forwarded to the service, which serves the files of the islands script. Requests for static files skip the decoration.

**2. Registration.** [`App/Program.cs`](./App/Program.cs):

```csharp
builder.Services.AddPicard(builder.Configuration);
// ...
app.UsePicard();
```

`AddPicard` registers an `HttpClient` for the service. Its URL comes from [`App/appsettings.json`](./App/appsettings.json):

```json
"Picard": {
  "Url": "http://localhost:5100/"
}
```

**3. The markup.** [`App/Pages/Shared/_Layout.cshtml`](./App/Pages/Shared/_Layout.cshtml) contains the `pi-part` elements and [`App/Pages/Index.cshtml`](./App/Pages/Index.cshtml) the components:

```html
<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
<pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":5}'></pi-component>
```

## Good to Know

- The decorator service is stateless. It can run as a sidecar container, and several instances can sit behind a load balancer.
- Buffering the response gives up streaming. Pages without micro frontends could skip the round trip, e.g., by checking for `<pi-` before posting.
- Picard.js only intercepts link clicks for its own client-side routing (a `<pi-slot rel="router">`), so the regular links of the Razor pages work as usual.

## Running

Start the decorator service:

```sh
cd ../../shared/picard-decorator
npm install
npm start
```

Start the ASP.NET Core application (requires the .NET 10 SDK):

```sh
cd App
dotnet run
```

Then open `http://localhost:5177`.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
