# vivia-marked
Add marked to Vivia

## Options
Options are put directly to [marked](https://marked.js.org/using_advanced#options).

In addition, some commonly used extensions can be enabled in options:
```yaml
plugins:
  renderer:
    marked:
      admonition: true
      katex: true
      bidi: true
      extendedTables: true
      highlight: true
```
If there is no the extension you need, you can create an issue or find another plugin