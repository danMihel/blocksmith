import { markRaw, type Plugin } from 'vue'
import { blockDefinitions } from '@/blocks'
import { BLOCK_REGISTRY_KEY, BlockRegistry } from '@/entities/block'

export const blockRegistry: Plugin = {
  install(app) {
    app.provide(BLOCK_REGISTRY_KEY, markRaw(new BlockRegistry(blockDefinitions)))
  },
}
