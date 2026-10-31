import { lazy, Suspense, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MorphToggle } from './components/MorphToggle'
import './new-updates.css'

const VerticalShowcase = lazy(() => import('./pages/VerticalShowcase'))
const ScrollMorphDemo = lazy(() => import('./components/ui/scroll-morph-demo'))

function Metadata() {
  const { pathname } = useLocation()
  const original = useRef({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
  })

  useEffect(() => {
    const isMorph = pathname.endsWith('/morph')
    document.title = `${isMorph ? 'Morph experiment' : 'Interactive portfolio'} — Deepak Sharma`
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Deepak Sharma — Senior Shopify and frontend developer crafting thoughtful, high-performing digital experiences.',
    )
  }, [pathname])

  useEffect(() => () => {
    document.title = original.current.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', original.current.description)
  }, [])

  return null
}

export default function NewUpdatesApp() {
  return (
    <div className="new-updates-shell">
      <Metadata />
      <Suspense fallback={<main className="showcase-loading">Loading experience…</main>}>
        <Routes>
          <Route index element={<VerticalShowcase />} />
          <Route path="morph" element={<main className="morph-page"><ScrollMorphDemo /></main>} />
          <Route path="*" element={<Navigate to="/new-updates" replace />} />
        </Routes>
      </Suspense>
      <MorphToggle />
    </div>
  )
}
