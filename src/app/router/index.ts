import { createRouter, createWebHistory } from 'vue-router'
import { APP_NAME, RouteName } from '@/shared/config'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.Dashboard,
      component: () => import('@/pages/dashboard').then((m) => m.DashboardPage),
      meta: { title: 'Pages' },
    },
    {
      path: '/editor/:id',
      name: RouteName.Editor,
      component: () => import('@/pages/editor').then((m) => m.EditorPage),
      props: true,
      meta: { title: 'Editor' },
    },
    {
      path: '/preview/:id',
      name: RouteName.Preview,
      component: () => import('@/pages/preview').then((m) => m.PreviewPage),
      props: true,
      meta: { title: 'Preview' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: RouteName.NotFound,
      component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
      meta: { title: 'Not found' },
    },
  ],
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})
