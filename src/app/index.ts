import { createPinia } from 'pinia'
import { createApp as createVueApp } from 'vue'
import App from './App.vue'
import { blockRegistry } from './providers/block-registry'
import { documentRepository } from './providers/document-repository'
import { router } from './router'
import './styles/main.css'

export function createApp() {
  const app = createVueApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(blockRegistry)
  app.use(documentRepository)

  return app
}
