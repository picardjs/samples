/// <reference types="@solidjs/start/env" />

import "solid-js";

type PicardElement = import("solid-js").JSX.HTMLAttributes<HTMLElement> & {
  name?: string;
  source?: string;
  data?: string;
  server?: "none";
};

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "pi-component": PicardElement;
      "pi-slot": PicardElement;
      "pi-part": PicardElement;
    }
  }
}
