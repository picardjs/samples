# Picard.js with htmx (FastAPI)

A Python application ([FastAPI](https://fastapi.tiangolo.com) and Jinja2) using [htmx](https://htmx.org) to swap HTML fragments. Micro frontends are rendered on the server, in full pages and in fragments, and resumed in the browser after each swap.

## What Picard.js Does Here

htmx replaces parts of the page with HTML fragments fetched from the server. Those fragments can contain micro frontends too, so they have to be rendered on the server *for every fragment*, not just for the first page. And the server is Python, so Picard.js runs as a separate **decorator service**:

```
Browser ──► FastAPI ──(page or fragment)──► decorator service (Node.js, picard-js/node)
        ◄── decorated HTML ◄──────────────┘
```

1. FastAPI renders a page or a fragment (`/panels/*`) with Jinja2.
2. A middleware posts every HTML response, full documents and fragments alike, to the decorator service, which renders the micro frontends into it.
3. In the browser, the islands script is loaded once with the full page. When htmx swaps in a fragment, the islands script **unmounts** the micro frontends that were swapped out and **resumes** the new ones: `pi-ssr-html` is hydrated and the client-only ones (`server="none"`) are rendered.

The decorator service is [`shared/picard-decorator`](../../shared/picard-decorator/). The [ASP.NET Core](../../aspnet/ssr/) sample uses it too.

## How It Is Integrated

**1. The middleware.** [`app/picard.py`](./app/picard.py) decorates all HTML responses:

```python
class PicardMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        if not response.headers.get("content-type", "").startswith("text/html"):
            return response

        body = b"".join([chunk async for chunk in response.body_iterator])
        decorated = await self.client.post("decorate", content=body, headers={"content-type": "text/html"})
        decorated.raise_for_status()
        headers = {k: v for k, v in response.headers.items() if k.lower() != "content-length"}
        return Response(decorated.content, status_code=response.status_code, headers=headers)
```

`add_picard(app)` registers it, together with a route proxying the files of the islands script:

```python
@app.get("/picard/{file}")
async def islands_file(file: str):
    res = await client.get(f"picard/{file}")
    return Response(res.content, status_code=res.status_code, media_type="text/javascript")
```

**2. The application.** [`app/main.py`](./app/main.py) calls `add_picard(app)` and has two routes: the page and the fragments.

```python
@app.get("/panels/{name}")
async def panel(request: Request, name: str):
    # a fragment swapped in by htmx - the decorator renders its micro frontends, too
    return templates.TemplateResponse(request, "panel.html", {"panel": name, **PANELS[name]})
```

**3. The templates.** [`app/templates/index.html`](./app/templates/index.html) is the page with the `pi-part` elements and the htmx buttons (simplified):

```html
<button hx-get="/panels/counter" hx-target="#panel">Counter</button>
<button hx-get="/panels/more" hx-target="#panel">More</button>
<div id="panel">{% include "panel.html" %}</div>
<pi-part name="script"></pi-part>
```

[`app/templates/panel.html`](./app/templates/panel.html) is the fragment with the micro frontends:

```html
<pi-component name="counter" source="pi-simple-html" server="none"></pi-component>
<pi-component name="ssr-counter" source="pi-ssr-html" data='{"start":{{ start }}}'></pi-component>
```

## Good to Know

- Fragments contain no `pi-part` elements, so decorating them only renders the components. The state and the islands script come with the first full page.
- The same middleware handles pages and fragments. No htmx-specific code is needed on the server or in the browser.

## Running

Start the decorator service:

```sh
cd ../../shared/picard-decorator
npm install
npm start
```

Start the FastAPI application (requires [uv](https://docs.astral.sh/uv/)):

```sh
uv run uvicorn app.main:app --port 8000
```

Then open `http://localhost:8000` and switch between the panels.

The URL of the decorator service can be changed with the `PICARD_URL` environment variable (default: `http://localhost:5100/`).

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
