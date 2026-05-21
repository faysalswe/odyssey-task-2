import React, { useEffect, useRef } from 'react'
import { MAP_SIZE, MAP_WORLD_EXTENT, DOT_RADIUS, GRID_DIVISIONS, TRAIL_MAX_POINTS } from '../../constants/minimap'
import styles from './MiniMap.module.css'

interface MiniMapProps {
  posRef: React.MutableRefObject<{ x: number; z: number }>
}

const SCALE = MAP_SIZE / (MAP_WORLD_EXTENT * 2)

function worldToCanvas(v: number): number {
  return MAP_SIZE / 2 + v * SCALE
}

export function MiniMap({ posRef }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trail = useRef<{ x: number; z: number }[]>([])
  const lastPos = useRef<{ x: number; z: number }>({ x: Infinity, z: Infinity })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number

    const draw = () => {
      const { x, z } = posRef.current

      // Record trail only when the fox actually moved
      if (Math.abs(x - lastPos.current.x) > 0.05 || Math.abs(z - lastPos.current.z) > 0.05) {
        trail.current.push({ x, z })
        if (trail.current.length > TRAIL_MAX_POINTS) trail.current.shift()
        lastPos.current = { x, z }
      }

      ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE)

      // Background
      ctx.fillStyle = 'rgba(15, 20, 30, 0.85)'
      ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)

      // Grid lines
      const cellPx = MAP_SIZE / GRID_DIVISIONS
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = 1
      for (let i = 1; i < GRID_DIVISIONS; i++) {
        const p = i * cellPx
        ctx.beginPath(); ctx.moveTo(p, 0);       ctx.lineTo(p, MAP_SIZE); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, p);       ctx.lineTo(MAP_SIZE, p); ctx.stroke()
      }

      // Centre crosshair
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(MAP_SIZE / 2, 0);       ctx.lineTo(MAP_SIZE / 2, MAP_SIZE); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, MAP_SIZE / 2);       ctx.lineTo(MAP_SIZE, MAP_SIZE / 2); ctx.stroke()

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, MAP_SIZE - 1, MAP_SIZE - 1)

      // Trail
      if (trail.current.length > 1) {
        const len = trail.current.length
        for (let i = 1; i < len; i++) {
          const alpha = i / len                 // fades from transparent to opaque
          ctx.beginPath()
          ctx.moveTo(worldToCanvas(trail.current[i - 1].x), worldToCanvas(trail.current[i - 1].z))
          ctx.lineTo(worldToCanvas(trail.current[i].x),     worldToCanvas(trail.current[i].z))
          ctx.strokeStyle = `rgba(79, 195, 247, ${alpha * 0.7})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // Fox dot
      const px = worldToCanvas(x)
      const py = worldToCanvas(z)

      // Glow ring
      ctx.beginPath()
      ctx.arc(px, py, DOT_RADIUS + 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(79, 195, 247, 0.2)'
      ctx.fill()

      // Solid dot
      ctx.beginPath()
      ctx.arc(px, py, DOT_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = '#4fc3f7'
      ctx.fill()

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [posRef])

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
