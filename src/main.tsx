import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import './store/store.css'
import App from './App.tsx'
import { ProductPage } from './store/ProductPage.tsx'
import { StoreIndex } from './store/StoreIndex.tsx'
import { ScrollBehaviour } from './store/ScrollBehaviour.tsx'
import { startAnalytics } from './lib/analytics.ts'
import { StatsigAnalytics } from './lib/statsig.tsx'

startAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsigAnalytics>
      <BrowserRouter>
        <ScrollBehaviour />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/store" element={<StoreIndex />} />
          <Route path="/store/:slug" element={<ProductPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </StatsigAnalytics>
  </StrictMode>,
)
