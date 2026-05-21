import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { ANIMATION_IDLE, ANIMATION_WALK, WALK_SPEED } from '../../constants/animations'
import { MAP_WORLD_EXTENT } from '../../constants/minimap'
import { useKeyboard } from '../../hooks/useKeyboard'

interface AvatarProps {
  posRef: { current: { x: number; z: number } }
}

const GLB_PATH = '/assets/fox.glb'

export function Avatar({ posRef }: AvatarProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(GLB_PATH)
  const { actions } = useAnimations(animations, group)
  const keys = useKeyboard()
  const currentAction = useRef<string>(ANIMATION_IDLE)
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    actions[ANIMATION_IDLE]?.play()
  }, [actions])

  useFrame((_, delta) => {
    if (!group.current) return

    const { forward, backward, left, right } = keys.current
    const moving = forward || backward || left || right

    // Switch animation clip when movement state changes
    const targetAnim = moving ? ANIMATION_WALK : ANIMATION_IDLE
    if (targetAnim !== currentAction.current) {
      const from = actions[currentAction.current]
      const to = actions[targetAnim]
      from?.fadeOut(0.2)
      to?.reset().fadeIn(0.2).play()
      currentAction.current = targetAnim
    }

    if (!moving) return

    // Build movement direction in world space (camera-independent top-down)
    const dir = new THREE.Vector3()
    if (forward) dir.z -= 1
    if (backward) dir.z += 1
    if (left) dir.x -= 1
    if (right) dir.x += 1
    dir.normalize()

    // Rotate character to face direction of travel
    const targetAngle = Math.atan2(dir.x, dir.z)
    group.current.rotation.y = targetAngle

    // Move
    velocity.current.copy(dir).multiplyScalar(WALK_SPEED * delta)
    group.current.position.add(velocity.current)

    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -MAP_WORLD_EXTENT, MAP_WORLD_EXTENT)
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -MAP_WORLD_EXTENT, MAP_WORLD_EXTENT)

    posRef.current = { x: group.current.position.x, z: group.current.position.z }
  })

  return <primitive ref={group} object={scene} />
}

useGLTF.preload(GLB_PATH)
