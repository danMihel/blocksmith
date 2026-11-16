import { markRaw, type Plugin } from 'vue'
import { blockDefinitions } from '@/blocks'
import { BLOCK_REGISTRY_KEY, BlockRegistry } from '@/entities/block'

/** The composition root of the block system: the only place that knows the concrete blocks. */
export const blockRegistry: Plugin = {
  install(app) {
    // Definitions hold components and schemas — they must never become reactive.
    app.provide(BLOCK_REGISTRY_KEY, markRaw(new BlockRegistry(blockDefinitions)))
  },
}
