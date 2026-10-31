import { Suspense, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@new/lib/utils"

type RingState = "hidden" | "animating" | "visible"
const MOON_TEXTURE = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg"
const PARTICLE_COUNT = 30000

function RealisticMoon({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const colorMap = useTexture(MOON_TEXTURE)

  useFrame((_, delta) => {
    if (meshRef.current && !reducedMotion) meshRef.current.rotation.y += delta * 0.08
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={colorMap} bumpMap={colorMap} bumpScale={0.02} roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

function createRing() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const randoms = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.pow(Math.random(), 1.5)
    const radius = 2.2 + distance * 2.2
    const ySpread = Math.random() + Math.random() + Math.random() - 1.5
    positions.set([Math.cos(angle) * radius, ySpread * (0.4 - distance * 0.2), Math.sin(angle) * radius], i * 3)

    const intensity = 1 - distance
    const palette = Math.random()
    const base = palette < 0.8 ? [0.25, 0.3, 0.35] : palette < 0.92 ? [0, 0.6, 0.8] : [0.6, 0.2, 0.8]
    const sparkle = Math.random() > 0.95 ? 2.5 : 1
    colors.set(base.map((value) => Math.min(1, Math.max(0, value + (Math.random() - 0.5) * 0.1)) * intensity * sparkle), i * 3)
    randoms[i] = Math.random()
  }
  return { positions, colors, randoms }
}

const ringData = createRing()

function ParticleRing({ ringState, reducedMotion }: { ringState: RingState; reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const progress = useRef(ringState === "visible" ? 1 : 0)
  const materialRef = useRef<THREE.PointsMaterial>(null)

  useFrame((_, delta) => {
    if (pointsRef.current && !reducedMotion) pointsRef.current.rotation.y -= delta * 0.035
    const target = ringState === "hidden" ? 0 : 1
    progress.current = THREE.MathUtils.damp(progress.current, target, reducedMotion ? 100 : 2.2, delta)
    if (materialRef.current) {
      materialRef.current.opacity = progress.current
      materialRef.current.size = 0.012 * progress.current
    }
  })

  return (
    <points ref={pointsRef} scale={ringState === "hidden" ? 0.95 : 1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[ringData.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[ringData.colors, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[ringData.randoms, 1]} />
      </bufferGeometry>
      <pointsMaterial ref={materialRef} size={0} vertexColors transparent opacity={0} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

type Asteroid = {
  angle: number; radius: number; amplitude: number; phase: number; radialSpeed: number; z: number; speed: number
  rotation: THREE.Euler; rotationSpeed: THREE.Vector3; scale: number
}

function createAsteroids(count: number): Asteroid[] {
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 2.8 + Math.random() * 2,
    amplitude: 0.5 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
    radialSpeed: 0.15 + Math.random() * 0.25,
    z: (Math.random() - 0.5) * 0.8,
    speed: (0.06 + Math.random() * 0.1) * (Math.random() > 0.5 ? 1 : -1),
    rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
    rotationSpeed: new THREE.Vector3((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05),
    scale: 0.02 + Math.pow(Math.random(), 4) * 0.18,
  })).sort((a, b) => b.scale - a.scale)
}

function AsteroidBelt({ ringState, reducedMotion }: { ringState: RingState; reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const texture = useTexture(MOON_TEXTURE)
  const asteroids = useMemo(() => createAsteroids(75), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const visibleScale = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    visibleScale.current = THREE.MathUtils.damp(visibleScale.current, ringState === "hidden" ? 0 : 1, reducedMotion ? 100 : 3, delta)
    meshRef.current.visible = visibleScale.current > 0.01

    asteroids.forEach((asteroid, index) => {
      if (!reducedMotion) {
        asteroid.angle += asteroid.speed * delta
        asteroid.phase += asteroid.radialSpeed * delta
        asteroid.rotation.x += asteroid.rotationSpeed.x
        asteroid.rotation.y += asteroid.rotationSpeed.y
        asteroid.rotation.z += asteroid.rotationSpeed.z
      }
      const radius = Math.max(2.15, asteroid.radius + Math.sin(asteroid.phase) * asteroid.amplitude)
      dummy.position.set(Math.cos(asteroid.angle) * radius, asteroid.z, Math.sin(asteroid.angle) * radius)
      dummy.rotation.copy(asteroid.rotation)
      dummy.scale.setScalar(asteroid.scale * visibleScale.current)
      dummy.updateMatrix()
      meshRef.current?.setMatrixAt(index, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 75]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.08} roughness={0.7} metalness={0.1} />
    </instancedMesh>
  )
}

export interface LunarGravityCardProps {
  className?: string
  title?: React.ReactNode
  description?: React.ReactNode
}

export default function LunarGravityCard({
  className,
  title = <><span className="text-zinc-50">Lunar</span><br /><span className="bg-gradient-to-b from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent">Gravity.</span></>,
  description = "A tactile WebGL experiment where atmosphere, interaction and performance orbit the same idea.",
}: LunarGravityCardProps) {
  const ringState: RingState = "visible"
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <article className={cn("relative flex min-h-[650px] w-full max-w-[1000px] flex-col overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-black shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:h-[540px] md:min-h-0 md:flex-row", className)}>
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-[62%] w-full bg-gradient-to-b from-black via-black/90 to-transparent md:h-full md:w-[62%] md:bg-gradient-to-r" />
      <div className="pointer-events-none relative z-20 flex w-full flex-col justify-center px-8 py-12 md:w-[47%] md:pl-16 md:pr-0">
        <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Orbital study / WebGL</p>
        <h2 className="mb-6 text-[4rem] font-bold leading-[0.88] tracking-[-0.07em] md:text-[5.5rem]">{title}</h2>
        <p className="max-w-[340px] text-base font-medium leading-relaxed text-zinc-400 md:text-lg">{description}</p>
        <p className="mt-7 text-[10px] uppercase tracking-[0.16em] text-zinc-600" aria-live="polite">
          Fixed at -27° axial tilt
        </p>
      </div>

      <div className="relative z-0 flex h-[420px] w-full items-center justify-center md:absolute md:right-0 md:top-0 md:h-full md:w-[67%]">
        <Canvas shadows camera={{ position: [0, 4, 10], fov: 45 }} dpr={[1, 1.5]} frameloop={reducedMotion ? "demand" : "always"}>
          <ambientLight intensity={0.03} />
          <directionalLight position={[8, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-5, -3, -5]} intensity={0.15} color="#4a90e2" />
          <group rotation={[0, 0, THREE.MathUtils.degToRad(-27)]}>
            <Suspense fallback={null}>
              <RealisticMoon reducedMotion={reducedMotion} />
              <ParticleRing ringState={ringState} reducedMotion={reducedMotion} />
              <AsteroidBelt ringState={ringState} reducedMotion={reducedMotion} />
              <Environment preset="city" />
            </Suspense>
          </group>
        </Canvas>
      </div>
    </article>
  )
}

export { LunarGravityCard as Component }
