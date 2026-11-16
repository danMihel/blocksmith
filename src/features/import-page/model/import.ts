import type { BlockRegistry } from '@/entities/block'
import {
  cloneDocument,
  type DocumentIssue,
  type DocumentRepository,
  type PageDocument,
  parseDocument,
} from '@/entities/document'

export type ImportResult =
  | { ok: true; document: PageDocument; issues: DocumentIssue[] }
  | { ok: false; reason: string; issues: DocumentIssue[] }

export function importDocument(text: string, registry: BlockRegistry): ImportResult {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'The file is not valid JSON.', issues: [] }
  }

  const result = parseDocument(json, registry)
  if (!result.ok) {
    return { ok: false, reason: 'This is not a Blocksmith project file.', issues: result.issues }
  }
  return { ok: true, document: cloneDocument(result.document), issues: result.issues }
}

export async function importAndSave(
  text: string,
  registry: BlockRegistry,
  repository: DocumentRepository,
): Promise<ImportResult> {
  const result = importDocument(text, registry)
  if (result.ok) await repository.save(result.document)
  return result
}
