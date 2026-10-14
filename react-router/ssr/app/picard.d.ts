import type { DetailedHTMLProps, HTMLAttributes } from "react";

type PicardElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, string | undefined>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "pi-component": PicardElement;
      "pi-slot": PicardElement;
      "pi-part": PicardElement;
    }
  }
}
