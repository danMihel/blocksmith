import { inject, type InjectionKey } from 'vue'
import type { BlockCategory, BlockDefinition, BlockProps } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyBlockDefinition = BlockDefinition<any>

export class BlockRegistry {
  private readonly definitions = new Map<string, AnyBlockDefinition>()

  constructor(definitions: Iterable<AnyBlockDefinition> = []) {
    for (const definition of definitions) this.register(definition)
  }

  register(definition: AnyBlockDefinition): this {
    if (this.definitions.has(definition.type)) {
      throw new Error(`Block type "${definition.type}" is already registered`)
    }
    this.definitions.set(definition.type, definition)
    return this
  }

  get<P extends BlockProps = BlockProps>(type: string): BlockDefinition<P> | undefined {
    return this.definitions.get(type) as BlockDefinition<P> | undefined
  }

  has(type: string): boolean {
    return this.definitions.has(type)
  }

  list(): AnyBlockDefinition[] {
    return [...this.definitions.values()]
  }

  groupByCategory(): Map<BlockCategory, AnyBlockDefinition[]> {
    const groups = new Map<BlockCategory, AnyBlockDefinition[]>()
    for (const definition of this.definitions.values()) {
      const group = groups.get(definition.meta.category) ?? []
      group.push(definition)
      groups.set(definition.meta.category, group)
    }
    return groups
  }
}

export const BLOCK_REGISTRY_KEY: InjectionKey<BlockRegistry> = Symbol('BlockRegistry')

export function useBlockRegistry(): BlockRegistry {
  const registry = inject(BLOCK_REGISTRY_KEY, null)
  if (!registry) {
    throw new Error('Block registry is not provided. Install it in the app (see app/providers).')
  }
  return registry
}
