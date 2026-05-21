import { useRef, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Avatar } from '../Avatar/Avatar'
import { MiniMap } from '../MiniMap/MiniMap'
import styles from './Scene.module.css'

const ZOOM_MIN = 10
const ZOOM_MAX = 100
const ZOOM_DEFAULT = 50  // reference point: at this value camera sits at BASE_DIST
const ZOOM_INITIAL = 30  // slider starts here (zoomed out)
const CAM_Y = 56
const CAM_Z = 100
const BASE_DIST = Math.sqrt(CAM_Y ** 2 + CAM_Z ** 2)

interface CameraZoomProps {
  distance: number
}

function CameraZoom({ distance }: CameraZoomProps) {
  const { camera } = useThree()
  useEffect(() => {
    const targetDist = (ZOOM_DEFAULT / distance) * BASE_DIST
    const currentDist = camera.position.length()
    if (currentDist === 0) return
    // scale position along current direction — preserves orbit angle
    camera.position.multiplyScalar(targetDist / currentDist)
  }, [distance, camera])
  return null
}

export function Scene() {
  const posRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 })
  const [zoom, setZoom] = useState(ZOOM_INITIAL)

  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [0, CAM_Y, CAM_Z], fov: 50 }}
        shadows
        className={styles.canvas}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <Grid
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

        <Avatar posRef={posRef} />

        <CameraZoom distance={zoom} />
        <OrbitControls makeDefault enablePan={false} maxPolarAngle={Math.PI / 2.2} target={[0, 8, 0]} />
      </Canvas>

      <MiniMap posRef={posRef} />

      <div className={styles.zoomControl}>
        <span className={styles.zoomLabel}>Zoom</span>
        <input
          type="range"
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className={styles.zoomSlider}
        />
        <span className={styles.zoomValue}>{zoom}%</span>
      </div>

      <div className={styles.controls}>
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move
      </div>
    </div>
  )
}
