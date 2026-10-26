#!/usr/bin/env node
/**
 * Build static HTML pages from the Markdown files in this repository.
 *
 *   node build.js                 # write to dist/
 *   node build.js --out site      # write to site/
 *   node build.js --in-place      # write HTML next to each .md file
 *
 * An index file is emitted as index.html regardless of the case of its
 * source name, so INDEX.md and index.md both become index.html. Links to
 * .md files inside the Markdown are rewritten to the generated .html pages.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { marked } from 'marked';

const SKIP_DIRS = new Set(['node_modules', '.git', '.hg', '.svn']);
const DEFAULT_OUT = 'dist';

const HELP = `Usage: node build.js [options] [root]

Convert every Markdown file under root (default: current directory) to HTML.

Options:
  -o, --out <dir>   Output directory (default: ${DEFAULT_OUT})
  -i, --in-place    Write HTML next to the Markdown sources
  -h, --help        Show this help

INDEX.md and index.md are both emitted as index.html. Other names keep their
case: README.md becomes README.html. Links to .md files are rewritten to .html.
`;

function parseArgs(argv) {
  const opts = {
    root: process.cwd(),
    out: null,
    inPlace: false,
    help: false,
    rootGiven: false,
  };

  const args = [...argv];
  while (args.length > 0) {
    const arg = args.shift();

    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--in-place' || arg === '-i') {
      opts.inPlace = true;
    } else if (arg === '--out' || arg === '-o') {
      const value = args.shift();
      if (!value) throw new Error(`${arg} needs a directory`);
      opts.out = value;
    } else if (arg.startsWith('--out=')) {
      opts.out = arg.slice('--out='.length);
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (!opts.rootGiven) {
      opts.root = path.resolve(arg);
      opts.rootGiven = true;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  if (opts.inPlace && opts.out) {
    throw new Error('Use either --out or --in-place, not both');
  }

  return opts;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function escapeHtml(value) {
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(value).replace(/[&<>"']/g, (char) => replacements[char]);
}

function isExternal(href) {
  return (
    !href ||
    href.startsWith('#') ||
    href.startsWith('//') ||
    /^[a-z][a-z0-9+.-]*:/i.test(href)
  );
}

function outputName(fileName) {
  const base = fileName.slice(0, -3); // remove .md
  return base.toLowerCase() === 'index' ? 'index.html' : `${base}.html`;
}

function rewriteMarkdownLink(href) {
  if (isExternal(href) || !/\.md(?:[?#]|$)/i.test(href)) return href;

  const match = href.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  if (!match) return href;

  const [, pathname, query = '', hash = ''] = match;

  if (pathname.startsWith('/')) {
    const dir = path.posix.dirname(pathname);
    const base = path.posix.basename(pathname).slice(0, -3);
    const outBase = base.toLowerCase() === 'index' ? 'index.html' : `${base}.html`;
    return `${dir === '/' ? '' : dir}/${outBase}${query}${hash}`;
  }

  const dir = path.posix.dirname(pathname);
  const base = path.posix.basename(pathname).slice(0, -3);
  const outBase = base.toLowerCase() === 'index' ? 'index.html' : `${base}.html`;
  const outPath = dir === '.' ? outBase : `${dir}/${outBase}`;

  return `${outPath}${query}${hash}`;
}

marked.use({
  walkTokens(token) {
    if (token.type === 'link' && typeof token.href === 'string') {
      token.href = rewriteMarkdownLink(token.href);
    }
  },
});

function tokenText(token) {
  if (Array.isArray(token.tokens)) {
    return token.tokens.map(tokenText).join('');
  }
  return token.text ?? token.raw ?? '';
}

function extractTitle(markdown) {
  const tokens = marked.lexer(markdown);
  const heading = tokens.find((token) => token.type === 'heading' && token.depth === 1);
  return heading ? tokenText(heading).replace(/\s+/g, ' ').trim() : '';
}

function renderPage({ title, body, source, indexHref }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #ffffff;
      --fg: #1b1b1b;
      --muted: #666666;
      --accent: #006b52;
      --border: #dddddd;
      --code-bg: #f4f4f2;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111111;
        --fg: #e9e9e6;
        --muted: #9a9a94;
        --accent: #69d3b4;
        --border: #333333;
        --code-bg: #1c1c1b;
      }
    }

    * { box-sizing: border-box; }

    html { font-size: 18px; }

    body {
      max-width: 46rem;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
      background: var(--bg);
      color: var(--fg);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.65;
    }

    .site-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 2.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .site-header a {
      color: var(--fg);
      font-weight: 700;
      text-decoration: none;
    }

    .site-header .source {
      overflow: hidden;
      color: var(--muted);
      letter-spacing: 0;
      text-overflow: ellipsis;
      text-transform: none;
      white-space: nowrap;
    }

    h1, h2, h3, h4 {
      line-height: 1.25;
      margin-top: 2.25em;
      margin-bottom: 0.6em;
    }

    h1 {
      margin-top: 0;
      font-size: 2rem;
    }

    h2 { font-size: 1.45rem; }
    h3 { font-size: 1.15rem; }

    a { color: var(--accent); }

    img { max-width: 100%; height: auto; }

    code, pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.88em;
    }

    code {
      padding: 0.12em 0.3em;
      background: var(--code-bg);
      border-radius: 3px;
    }

    pre {
      overflow-x: auto;
      padding: 1rem;
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 5px;
      line-height: 1.45;
    }

    pre code {
      padding: 0;
      background: none;
    }

    blockquote {
      margin: 1.5rem 0;
      padding: 0.1rem 1rem;
      border-left: 3px solid var(--border);
      color: var(--muted);
    }

    table {
      display: block;
      overflow-x: auto;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }

    th, td {
      padding: 0.45rem 0.65rem;
      border: 1px solid var(--border);
      text-align: left;
      vertical-align: top;
    }

    th { background: var(--code-bg); }

    hr {
      margin: 2.5rem 0;
      border: 0;
      border-top: 1px solid var(--border);
    }

    footer {
      margin-top: 4rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      color: var(--muted);
      font-size: 0.78rem;
    }
  </style>
</head>
<body>
  <header class="site-header">
    <a href="${escapeHtml(indexHref)}">strandz</a>
    <span class="source">${escapeHtml(source)}</span>
  </header>
  <main>
${body}
  </main>
  <footer>Generated from <code>${escapeHtml(source)}</code>.</footer>
</body>
</html>
`;
}

function indexHrefFor(outFile, outDir) {
  const relative = path.relative(path.dirname(outFile), path.join(outDir, 'index.html'));
  return toPosix(relative) || 'index.html';
}

async function collectMarkdownFiles(root, outDir) {
  const files = [];
  const skipOut = path.resolve(outDir) !== path.resolve(root);

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        if (skipOut && path.resolve(fullPath) === path.resolve(outDir)) continue;
        await walk(fullPath);
      } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  await walk(root);
  return files;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    process.stdout.write(HELP);
    return;
  }

  const root = path.resolve(opts.root);
  const rootStat = await fs.stat(root).catch(() => null);
  if (!rootStat || !rootStat.isDirectory()) {
    throw new Error(`Not a directory: ${root}`);
  }

  const outDir = opts.inPlace
    ? root
    : path.resolve(root, opts.out ?? DEFAULT_OUT);

  const files = await collectMarkdownFiles(root, outDir);

  if (files.length === 0) {
    console.log(`No Markdown files found under ${root}`);
    return;
  }

  const emitted = new Map();
  let pages = 0;

  console.log(`Building ${files.length} Markdown file${files.length === 1 ? '' : 's'} into ${outDir}`);

  for (const file of files) {
    const sourceRel = toPosix(path.relative(root, file));
    const outRel = path.join(path.dirname(sourceRel), outputName(path.basename(file)));
    const outFile = path.join(outDir, outRel);

    if (emitted.has(outFile)) {
      throw new Error(
        `Output collision: ${emitted.get(outFile)} and ${sourceRel} both produce ${toPosix(outRel)}`,
      );
    }
    emitted.set(outFile, sourceRel);

    const markdown = await fs.readFile(file, 'utf8');
    const title = extractTitle(markdown) || path.basename(file, path.extname(file));
    const body = marked.parse(markdown);
    const html = renderPage({
      title,
      body,
      source: sourceRel,
      indexHref: indexHrefFor(outFile, outDir),
    });

    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, html, 'utf8');
    pages += 1;

    console.log(`  ${sourceRel} -> ${toPosix(path.relative(outDir, outFile))}`);
  }

  console.log(`\nGenerated ${pages} page${pages === 1 ? '' : 's'}.`);
}

main().catch((error) => {
  console.error(`build: ${error.message}`);
  process.exitCode = 1;
});
