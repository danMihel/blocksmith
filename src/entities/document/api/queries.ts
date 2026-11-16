import type { BlockRegistry } from '@/entities/block'
import { type DocumentIssue, parseDocument } from '../model/parse'
import type { PageDocument } from '../model/types'
import type { DocumentRepository } from './repository'

export type LoadResult =
  | { status: 'ok'; document: PageDocument; issues: DocumentIssue[] }
  | { status: 'not-found' }
  | { status: 'invalid'; issues: DocumentIssue[] }

export async function loadDocument(
  repository: DocumentRepository,
  registry: BlockRegistry,
  id: string,
): Promise<LoadResult> {
  const raw = await repository.get(id)
  if (raw === undefined) return { status: 'not-found' }

  const result = parseDocument(raw, registry)
  return result.ok
    ? { status: 'ok', document: result.document, issues: result.issues }
    : { status: 'invalid', issues: result.issues }
}

export async function listDocuments(
  repository: DocumentRepository,
  registry: BlockRegistry,
): Promise<{ documents: PageDocument[]; unreadable: number }> {
  const results = (await repository.list()).map((raw) => parseDocument(raw, registry))
  const documents = results
    .flatMap((r) => (r.ok ? [r.document] : []))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return { documents, unreadable: results.length - documents.length }
}
