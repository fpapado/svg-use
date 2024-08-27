---
'@svg-use/core': minor
---

Breaking: `defaultThemeSubstitution` now takes an option object, so its
signature has changed to a factory:

```diff-js
const options = {
-  getThemeSubstitutions: defaultThemeSubstitution
+  getThemeSubstitutions: defaultThemeSubstitution()
}
```

`defaultThemeSubstitution` now provides a `monochromeCssVarFallback` option, to
allow passing `currentColor` as the `var()` fallback.
