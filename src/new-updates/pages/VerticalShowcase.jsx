import { lazy, Suspense, useEffect } from 'react'
import { Keyboard, Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react'
import { Link } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/pagination'

const RobotHeroDemo = lazy(() => import('../components/ui/robot-hero-demo'))
const LunarGravityCard = lazy(() => import('../components/ui/lunar-gravity-card'))
const OrbitalHeroDemo = lazy(() => import('../components/ui/orbital-hero-demo'))
const StackFeatureSection = lazy(() => import('../components/ui/stack-feature-section'))
const ImageStreamDemo = lazy(() => import('../components/ui/image-stream-demo'))

const slides = [
  ['Robot', RobotHeroDemo],
  ['Lunar', LunarGravityCard],
  ['Orbital', OrbitalHeroDemo],
  ['Stack', StackFeatureSection],
  ['Stream', ImageStreamDemo],
]

function ShowcaseSlide({ Slide }) {
  const { isActive, isPrev, isNext } = useSwiperSlide()
  if (!isActive && !isPrev && !isNext) return null
  return <Suspense fallback={<div className="slide-loading" aria-label="Loading section" />}><Slide embedded isActive={isActive} /></Suspense>
}

export default function VerticalShowcase() {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  return (
    <main className="vertical-showcase">
      <Swiper
        className="showcase-swiper"
        direction="vertical"
        slidesPerView={1}
        speed={850}
        modules={[Mousewheel, Keyboard, Pagination]}
        mousewheel={{ forceToAxis: true, releaseOnEdges: false, thresholdDelta: 18, thresholdTime: 450 }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => `<button class="${className}" type="button"><span>${slides[index][0]}</span></button>`,
        }}
        resistanceRatio={0}
        aria-label="Portfolio sections"
      >
        {slides.map(([label, Slide]) => (
          <SwiperSlide key={label} aria-label={label}>
            <ShowcaseSlide Slide={Slide} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Link className="explore-projects-fab" to="/new-updates/projects"><span>Explore</span> Projects <i aria-hidden="true">↗</i></Link>
    </main>
  )
}
