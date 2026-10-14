# Picard.js with Angular (SPA)

An Angular 19 single-page application created with the Angular CLI. It shows micro frontends in a component template, much like any other element.

## What Picard.js Does Here

Everything happens in the browser. Picard.js fetches the `picard-demos` feed, loads the micro frontends when their `pi-component` elements show up in the DOM, and mounts their components. Angular renders the `pi-component` elements but never looks inside them, so the two don't get in each other's way. The page uses three micro frontends with three different formats: a Module Federation container (`mf-simple-html`), a Native Federation module (`nfsimplehtml`), and a pilet (`pi-simple-html`).

## How It Is Integrated

**1. Start Picard.js next to Angular.** [`src/main.ts`](./src/main.ts) bootstraps the application and initializes Picard.js at the same time. Neither waits for the other: the `pi-component` elements upgrade as soon as Picard.js has defined them.

```ts
import { initializePicard } from 'picard-js/client';

Promise.all([
  bootstrapApplication(AppComponent, appConfig),
  initializePicard({
    feed: 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos',
  }),
]).catch((err) => console.error(err));
```

**2. Allow custom elements in the template.** Angular rejects unknown elements, so [`src/app/app.component.ts`](./src/app/app.component.ts) declares `CUSTOM_ELEMENTS_SCHEMA`:

```ts
@Component({
  selector: 'app-root',
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {}
```

**3. Place the components.** [`src/app/app.component.html`](./src/app/app.component.html) uses the elements like any other markup:

```html
<pi-component name="column" source="mf-simple-html"></pi-component>
<pi-component name="column" source="nfsimplehtml"></pi-component>
<pi-component name="counter" source="pi-simple-html"></pi-component>
```

## Good to Know

- `CUSTOM_ELEMENTS_SCHEMA` applies to the whole component. If you prefer stricter checks, wrap the `pi-component` elements in a small dedicated component that has the schema.
- Data for a component goes into the `data` attribute as JSON, e.g., `[attr.data]="json"`. Picard.js passes it to the component and updates it when the attribute changes.
- Angular's change detection doesn't need to know about the micro frontends. They manage their own DOM inside the `pi-component` element.

## Running

```sh
npm install
npm start
```

Then open `http://localhost:4200`. `npm run build` creates the production build in `dist/`.

See [Angular SSR](../ssr/) for the server-rendered variant.

---

**Picard.js** · [Website](https://picard.js.org) · [Repository](https://github.com/picardjs/picard) · [All samples](../../README.md)
