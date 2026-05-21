import { useEffect, useRef } from 'react'

interface KeyState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}

const KEY_MAP: Record<string, keyof KeyState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

export function useKeyboard(): React.RefObject<KeyState> {
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const action = KEY_MAP[e.code]
      if (action) keys.current[action] = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const action = KEY_MAP[e.code]
      if (action) keys.current[action] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return keys
}
