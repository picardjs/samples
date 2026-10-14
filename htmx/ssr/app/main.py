from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

from .picard import add_picard

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")
add_picard(app)

PANELS = {
    "counter": {"title": "Counter", "start": 5},
    "more": {"title": "More counting", "start": 100},
}


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse(request, "index.html", {"panel": "counter", **PANELS["counter"]})


@app.get("/panels/{name}")
async def panel(request: Request, name: str):
    # a fragment swapped in by htmx - the decorator renders its micro frontends, too
    return templates.TemplateResponse(request, "panel.html", {"panel": name, **PANELS[name]})
