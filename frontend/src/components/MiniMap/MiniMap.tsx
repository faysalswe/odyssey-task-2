import { useEffect, useRef } from 'react'
import { MAP_SIZE, MAP_WORLD_EXTENT, DOT_RADIUS } from '../../constants/minimap'
import styles from './MiniMap.module.css'

interface MiniMapProps {
  x: number
  z: number
}

export function MiniMap({ x, z }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE)

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)

    // Border
    ctx.strokeStyle = '#ffffff44'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, MAP_SIZE - 1, MAP_SIZE - 1)

    // Map world position → canvas pixel
    const scale = MAP_SIZE / (MAP_WORLD_EXTENT * 2)
    const px = MAP_SIZE / 2 + x * scale
    const py = MAP_SIZE / 2 + z * scale

    // Dot
    ctx.beginPath()
    ctx.arc(px, py, DOT_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = '#4fc3f7'
    ctx.fill()
  }, [x, z])

  return (
    <canvas
      ref={canvasRef}
      width={MAP_SIZE}
      height={MAP_SIZE}
      className={styles.canvas}
      aria-label="Mini map"
    />
  )
}
