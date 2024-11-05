import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import { Suspense } from 'react'
import Loading from './components/Loading'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<Loading />}>
    <ConfigProvider theme={{
      
    }}>
      <RouterProvider router={routes} />
    </ConfigProvider>
  </Suspense>
)
