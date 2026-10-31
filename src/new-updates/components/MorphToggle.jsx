import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

export function MorphToggle() {
  const boundsRef = useRef(null)
  const draggedRef = useRef(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onMorphPage = pathname.endsWith('/morph')

  return (
    <div ref={boundsRef} className="morph-drag-boundary">
      <motion.button
        type="button"
        className="morph-toggle"
        drag
        dragConstraints={boundsRef}
        dragElastic={0.08}
        dragMomentum={false}
        whileDrag={{ scale: 1.08, cursor: 'grabbing' }}
        onDragStart={() => { draggedRef.current = false }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) + Math.abs(info.offset.y) > 6) draggedRef.current = true
        }}
        onClick={() => {
          if (draggedRef.current) {
            draggedRef.current = false
            return
          }
          navigate(onMorphPage ? '/new-updates' : '/new-updates/morph')
        }}
        aria-label={onMorphPage ? 'Return to the vertical showcase' : 'Open the morph page'}
      >
        <span>{onMorphPage ? 'Back' : 'Morph'}</span>
        <i aria-hidden="true">{onMorphPage ? '←' : '↗'}</i>
      </motion.button>
    </div>
  )
}
