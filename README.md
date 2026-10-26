# strandz

site

## Build

Pages are written in Markdown and converted to HTML by `build.js`.

```sh
npm install
npm run build
```

The generated site goes to `dist/`, keeping the source directory structure.
`INDEX.md` becomes `index.html`, and links between `.md` files are rewritten
to point at the generated `.html` pages.

To write the HTML next to the Markdown sources instead:

```sh
npm run build:in-place
```

To choose another output directory:

```sh
node build.js --out <dir>
```
