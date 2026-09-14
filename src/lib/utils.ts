import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge doesn't know our custom fluid font-size scale (display-1/2,
 * heading-1/2/3, body-lg/body/body-sm, caption — see tailwind.config.ts). Left
 * as plain `twMerge`, it misclassifies `text-display-2` as a text-*color*
 * utility, sees it "conflict" with `text-ink`, and silently drops one of them
 * whenever both are passed to `cn()` together. Extending the font-size class
 * group here is what makes that combination safe everywhere in the app.
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-1", "display-2", "heading-1", "heading-2", "heading-3", "body-lg", "body", "body-sm", "caption"] },
      ],
    },
  },
});

/** Merge Tailwind class names, resolving conflicts (last wins). */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
