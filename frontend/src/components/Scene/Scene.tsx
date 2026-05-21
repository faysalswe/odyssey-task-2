import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Avatar } from '../Avatar/Avatar'
import { MiniMap } from '../MiniMap/MiniMap'
import styles from './Scene.module.css'

export function Scene() {
  const posRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 })

  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [0, 8, 14], fov: 50 }}
        shadows
        className={styles.canvas}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Ground */}
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

        {/* Avatar */}
        <Avatar posRef={posRef} />

        {/* Camera helper — disabled in prod; keeps orbit for development viewing */}
        <OrbitControls makeDefault enablePan={false} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>

      <MiniMap posRef={posRef} />

      <div className={styles.controls}>
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to move
      </div>
    </div>
  )
}
