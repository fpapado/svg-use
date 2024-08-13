# TODO

- Implement webpack example
  - Perhaps export pre-configured webpack resource queries
- Implement "unthemed" mode
- Align resource queries between webpack and rollup (?svgUse&noTheme)
- Remove baked-in react component, or make it customisable
- Investigate removing the need for a viewBox (perhaps we need to ensure that a
  viewBox exists, but not that it lines up)
- If needed: separate Vite plugin (though Rolup-only is OK for now)
  - Perhaps it is ok to only do checks, but return the original asset, and leave
    the rest to a ClI
