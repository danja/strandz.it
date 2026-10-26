# strandz

site

## Build

Pages are written in Markdown and converted to HTML by `build.js`.

```sh
npm install
npm run build
```

The generated site goes to `dist/`, keeping the source directory structure.
`index.md` (or `INDEX.md`) becomes `index.html`, and links between `.md` files
are rewritten to point at the generated `.html` pages.

## Page metadata

Pages can set metadata in YAML front matter. It is removed from the rendered
Markdown and used to fill the HTML `<head>`:

```md
---
title: Projects
description: An index of projects, grouped by category.
author: Danny Ayers
lang: en
canonical: https://strandz.it/
ogType: website
keywords:
  - projects
  - audio
---

# Projects
```

Supported fields: `title`, `description`, `author`, `lang`, `keywords`, `tags`,
`canonical`, `image`, `ogType`, `siteName`, `robots`, `noindex`, `date`, and
`draft`. Set `draft: true` to leave a page out of the build. If `title` is
absent, the first `#` heading is used, falling back to the filename.

To write the HTML next to the Markdown sources instead:

```sh
npm run build:in-place
```

To choose another output directory:

```sh
node build.js --out <dir>
```
