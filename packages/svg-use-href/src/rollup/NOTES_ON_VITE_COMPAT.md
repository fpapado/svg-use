In Vite, `this.emitFile` is a no-op in serve mode. We should have a separate
plugin from the Rollup one. It would adjust serve mode to store the asset in
memory and serve from the dev server (how?), instead of using emitFile. However,
how will we resolve the asset reference?

```tsx
if (mode === 'serve') {
  const emittedFiles = new Map<string, EmittedAsset>();
  function emitFileToMemory(emitted: EmittedAsset) {
    files.set(emitted.name, emitted);
  }

  // in load
  emitFileToMemory(/* as before, but under what path? */);

  // in configureServer (https://vitejs.dev/guide/api-plugin#configureserver)
  server.middlewares.use((req, res, next) => {
    // custom handle request...
    if (emittedFiles.has(req.href)) {
      return emittedFiles.get();
    }
  });

  // Need to figure out how to pass the URL, perhaps `new URL(..., import.meta.url).href` will be good enough
}
```
