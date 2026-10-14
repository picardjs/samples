import os

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware

# the decorator service (see shared/picard-decorator) rendering the micro frontends
PICARD_URL = os.environ.get("PICARD_URL", "http://localhost:5100/")


class PicardMiddleware(BaseHTTPMiddleware):
    """Lets the decorator service render the micro frontends into the HTML responses -
    full documents as well as the fragments requested by htmx."""

    def __init__(self, app, client: httpx.AsyncClient):
        super().__init__(app)
        self.client = client

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        if not response.headers.get("content-type", "").startswith("text/html"):
            return response

        body = b"".join([chunk async for chunk in response.body_iterator])
        decorated = await self.client.post("decorate", content=body, headers={"content-type": "text/html"})
        decorated.raise_for_status()
        headers = {k: v for k, v in response.headers.items() if k.lower() != "content-length"}
        return Response(decorated.content, status_code=response.status_code, headers=headers)


def add_picard(app: FastAPI):
    client = httpx.AsyncClient(base_url=PICARD_URL)

    @app.get("/picard/{file}")
    async def islands_file(file: str):
        # the files of the islands script are served by the decorator service
        res = await client.get(f"picard/{file}")
        return Response(res.content, status_code=res.status_code, media_type="text/javascript")

    app.add_middleware(PicardMiddleware, client=client)
