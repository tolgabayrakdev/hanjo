import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import { Suspense } from 'react'
import Loading from './components/loading'
import { ThemeProvider } from './components/theme-provider'

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<Loading />}>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <RouterProvider router={routes} />
    </ThemeProvider>
  </Suspense>
)
