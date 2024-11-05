import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import { Suspense } from 'react'
import Loading from './components/Loading'

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<Loading />}>
    <RouterProvider router={routes} />
  </Suspense>
)
