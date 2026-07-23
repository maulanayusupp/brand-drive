// =============================================================================
// Input controller. Unifies keyboard and on-screen (touch) input into a single
// normalized state consumed by the car each frame.
// =============================================================================
export type InputAction = 'forward' | 'backward' | 'left' | 'right' | 'brake' | 'boost'

export interface InputState {
  throttle: number // -1..1
  steer: number // -1..1 (left negative, right positive)
  brake: boolean
  boost: boolean
}

const KEY_MAP: Record<string, InputAction> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'brake',
  ShiftLeft: 'boost',
  ShiftRight: 'boost',
}

export class InputController {
  private pressed = new Set<InputAction>()
  private enabled = false

  private readonly onKeyDown = (e: KeyboardEvent) => {
    const action = KEY_MAP[e.code]
    if (!action) return
    if (this.enabled) e.preventDefault()
    this.pressed.add(action)
  }

  private readonly onKeyUp = (e: KeyboardEvent) => {
    const action = KEY_MAP[e.code]
    if (!action) return
    this.pressed.delete(action)
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown, { passive: false })
    window.addEventListener('keyup', this.onKeyUp)
  }

  detach() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    this.pressed.clear()
  }

  setEnabled(value: boolean) {
    this.enabled = value
    if (!value) this.pressed.clear()
  }

  /** Programmatic press/release for on-screen touch buttons. */
  press(action: InputAction) {
    this.pressed.add(action)
  }

  release(action: InputAction) {
    this.pressed.delete(action)
  }

  getState(): InputState {
    const forward = this.pressed.has('forward') ? 1 : 0
    const backward = this.pressed.has('backward') ? 1 : 0
    const left = this.pressed.has('left') ? 1 : 0
    const right = this.pressed.has('right') ? 1 : 0
    return {
      throttle: forward - backward,
      steer: right - left,
      brake: this.pressed.has('brake'),
      boost: this.pressed.has('boost'),
    }
  }
}
