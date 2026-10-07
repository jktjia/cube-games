import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import './styles.css'
import { Toaster } from 'sonner'
import { HeadProvider } from 'react-head'
import reportWebVitals from './reportWebVitals.ts'
import BaseLayout from './layouts/base-layout.tsx'
import MergeGame from './pages/merge-game.tsx'
import Minesweeper from './pages/minesweeper.tsx'
import TextLayout from './layouts/secret-layout.tsx'
import {
  ABOUT_PATH,
  DONT_LEAVE_PATH,
  MERGE_PATH,
  MINESWEEPER_PATH,
  MONITOR_PATH,
  SETTINGS_PATH,
  SNAKE_PATH,
  TETRIS_PATH,
} from './utils/paths.ts'
import Stay from './pages/stay.tsx'
import Tetris from './pages/tetris.tsx'
import MainLayout from './layouts/main-layout.tsx'
import Settings from './pages/settings.tsx'
import Snake from './pages/snake.tsx'
import Home from './pages/home.tsx'
import { ThemeProvider } from './components/providers/theme-provider.tsx'
import MonitorEmpty from './pages/monitor-empty.tsx'
import About from './pages/about.tsx'
import BackLayout from './layouts/back-layout.tsx'

const rootRoute = createRootRoute({
  component: BaseLayout,
})

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main',
  component: MainLayout,
})

const textRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'text',
  component: TextLayout,
})

const riceRoute = createRoute({
  getParentRoute: () => textRoute,
  id: 'rice',
  component: BackLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: '/',
  component: Home,
})

const mergeRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: MERGE_PATH,
  component: MergeGame,
})

const mineRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: MINESWEEPER_PATH,
  component: Minesweeper,
})

const tetrisRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: TETRIS_PATH,
  component: Tetris,
})

const snakeRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: SNAKE_PATH,
  component: Snake,
})

const settingsRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: SETTINGS_PATH,
  component: Settings,
})

const aboutRoute = createRoute({
  getParentRoute: () => riceRoute,
  path: ABOUT_PATH,
  component: About,
})

const monitorRoute = createRoute({
  getParentRoute: () => riceRoute,
  path: MONITOR_PATH,
  component: MonitorEmpty,
})

const stayRoute = createRoute({
  getParentRoute: () => textRoute,
  path: DONT_LEAVE_PATH,
  component: Stay,
})

const routeTree = rootRoute.addChildren([
  mainRoute.addChildren([
    settingsRoute,
    indexRoute,
    mergeRoute,
    mineRoute,
    tetrisRoute,
    snakeRoute,
  ]),
  textRoute.addChildren([
    riceRoute.addChildren([aboutRoute, monitorRoute]),
    stayRoute,
  ]),
])

const hashHistory = createHashHistory()

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  basepath: '',
  history: hashHistory,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <HeadProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </HeadProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
