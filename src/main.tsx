import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import './store/store.css'
import About from './App.tsx'
import { ProductPage } from './store/ProductPage.tsx'
import { StoreIndex } from './store/StoreIndex.tsx'
import { ScrollBehaviour } from './store/ScrollBehaviour.tsx'
import { startAnalytics } from './lib/analytics.ts'
import { StatsigAnalytics } from './lib/statsig.tsx'
import { CartProvider } from './store/CartProvider.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { HomeRedirect } from './components/HomeRedirect.tsx'

startAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsigAnalytics>
      <ThemeProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollBehaviour />
            <Routes>
              {/* The store is the front door. */}
              <Route path="/" element={<StoreIndex />} />
              <Route path="/store/:slug" element={<ProductPage />} />

              {/* The original landing page. */}
              <Route path="/about-us" element={<About />} />

              {/* Retired store entry points, kept for links already out there. */}
              <Route path="/store" element={<HomeRedirect keepQuery />} />
              <Route path="/shop" element={<HomeRedirect keepQuery />} />
              <Route path="/shop/*" element={<HomeRedirect keepQuery />} />

              {/* Anything else: home, rather than a dead end. */}
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
    </StatsigAnalytics>
  </StrictMode>,
)
