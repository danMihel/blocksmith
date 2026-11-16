export const APP_NAME = 'Blocksmith'

export const RouteName = {
  Dashboard: 'dashboard',
  Editor: 'editor',
  Preview: 'preview',
  NotFound: 'not-found',
} as const

export type RouteName = (typeof RouteName)[keyof typeof RouteName]
