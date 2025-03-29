---
'@svg-use/webpack': major
'@svg-use/rollup': major
'@svg-use/react': major
'@svg-use/core': major
'@svg-use/vite': major
---

All `@svg-use` packages are now in v1! The external API should be unchanged from
the 0.x versions, with only a change to peer dependencies. Moreover, the default
value for `fallbackRootFill` has been changed to `#000`.

Changes since 0.x:

- `@svg-use/react` correctly declares peer dependencies on react and react-dom.
  Both versions ^18 and ^19 are allowed.
- `@svg-use/webpack`, `@svg-use/vite`, `@svg-use/rollup` correctly declare an
  **optional** peer dependency on `@svg-use/react`. This allows using other
  wrappers of your choice, without unnecessary installations. The installation
  instructions mention installing `@svg-use/react` directly in your project, if
  you use the default config. For example:

  ```console
  pnpm add --save-dev @svg-use/vite
  pnpm add @svg-use/react
  ```

- `@svg-use/webpack`, `@svg-use/vite`, `@svg-use/rollup` and
  `transformSvgForUseHref` from `@svg-use/core` now use a default value of
  `#000` for `fallbackRootFill`. This is overall a better default, because it
  accounts for SVGs that have no fill or stroke, while allowing theme
  substitutions to work seamlessly. If you find that this throws off existing
  substitutions functions, you are encouraged to change the setting and/or open
  an issue to discuss it.
