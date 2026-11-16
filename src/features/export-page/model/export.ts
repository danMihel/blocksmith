import { createApp, h, nextTick } from 'vue'
import { BLOCK_REGISTRY_KEY, type BlockRegistry } from '@/entities/block'
import { type PageDocument, PageRenderer } from '@/entities/document'
import { downloadFile, slugify } from '@/shared/lib'

export function exportJson(document: PageDocument) {
  downloadFile(
    `${slugify(document.name)}.blocksmith.json`,
    JSON.stringify(document, null, 2),
    'application/json',
  )
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

/**
 * All CSS rules currently applied to the app, with relative `url()`s made absolute so
 * fonts keep loading from the app's origin. Only Tailwind utilities that the app uses are
 * in there — the page's blocks are part of the app, so everything they need is included.
 */
function collectCss(): string {
  const rules: string[] = []
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) rules.push(rule.cssText)
    } catch {
      // Cross-origin stylesheet: not readable, not ours.
    }
  }
  return rules
    .join('\n')
    .replace(
      /url\((['"]?)(\/[^'")]+)\1\)/g,
      (_, quote, path) => `url(${quote}${location.origin}${path}${quote})`,
    )
}

/**
 * Renders the page with the same components the editor uses into a standalone HTML file.
 * Responsive behaviour survives because it is pure CSS (container queries), and interactive
 * bits (FAQ accordion, mobile menu) use native <details>, so no JavaScript is needed.
 */
export async function renderPageToHtml(
  page: PageDocument,
  registry: BlockRegistry,
): Promise<string> {
  const host = window.document.createElement('div')
  const app = createApp({
    render: () => h(PageRenderer, { blocks: page.blocks, theme: page.theme }),
  })
  app.provide(BLOCK_REGISTRY_KEY, registry)
  app.mount(host)
  await nextTick()
  const markup = host.innerHTML.replace(/<!--[\s\S]*?-->/g, '')
  app.unmount()

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Blocksmith">
<title>${escapeHtml(page.name)}</title>
<style>
${collectCss()}
html, body { margin: 0; background: ${page.theme.background}; }
</style>
</head>
<body>
${markup}
</body>
</html>
`
}

export async function exportHtml(page: PageDocument, registry: BlockRegistry) {
  downloadFile(`${slugify(page.name)}.html`, await renderPageToHtml(page, registry), 'text/html')
}
