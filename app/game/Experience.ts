// =============================================================================
// Experience — orchestrates the whole 3D scene: renderer, camera, lights,
// physics world, car, environment, input, the animation loop, camera work,
// proximity detection, coin scoring, and telemetry back to the Vue UI.
//
// This module is imported client-side only (via a .client.vue component), so
// static three/rapier imports never run during SSR.
// =============================================================================
import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import { Car } from './Car'
import { World, type SectionSpec } from './World'
import { InputController } from './input'
import type { GameTelemetry } from '~/types'

export interface ExperienceOptions {
  canvas: HTMLCanvasElement
  sections: SectionSpec[]
  onTelemetry: (t: Partial<GameTelemetry>) => void
  reducedMotion?: boolean
}

const _fwd = new THREE.Vector3()
const _desired = new THREE.Vector3()

export class Experience {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera: THREE.PerspectiveCamera
  private readonly clock = new THREE.Clock()

  private rapierWorld!: RAPIER.World
  private car!: Car
  private world!: World
  private readonly input = new InputController()

  private raf = 0
  private disposed = false
  private started = false
  private accumulator = 0
  private introAngle = Math.PI * 0.25
  private telemetryTimer = 0
  private score = 0
  private activeSectionId: string | null = null

  constructor(private readonly opts: ExperienceOptions) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500)
    this.camera.position.set(20, 18, 24)

    this.scene.background = new THREE.Color(0x070a12)
    this.scene.fog = new THREE.Fog(0x070a12, 45, 170)
  }

  async init() {
    this.setupLights()
    await RAPIER.init()
    this.rapierWorld = new RAPIER.World({ x: 0, y: -20, z: 0 })
    this.rapierWorld.timestep = 1 / 60

    this.world = new World(RAPIER, this.rapierWorld, this.scene, this.opts.sections)
    this.car = new Car(RAPIER, this.rapierWorld)
    this.scene.add(this.car.mesh)

    this.input.attach()
    window.addEventListener('resize', this.onResize)
    // Clicking / tapping the 3D stage enters drive mode (robust entry point
    // that does not depend on the Vue button ref).
    this.renderer.domElement.addEventListener('pointerdown', this.onCanvasPointerDown)
    this.onResize()

    this.opts.onTelemetry({ loading: false, ready: true })
    this.loop()
  }

  private setupLights() {
    const hemi = new THREE.HemisphereLight(0x9fb4ff, 0x0a0e18, 0.65)
    this.scene.add(hemi)

    const ambient = new THREE.AmbientLight(0xffffff, 0.15)
    this.scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 2.4)
    sun.position.set(30, 50, 20)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 160
    const s = 60
    sun.shadow.camera.left = -s
    sun.shadow.camera.right = s
    sun.shadow.camera.top = s
    sun.shadow.camera.bottom = -s
    sun.shadow.bias = -0.0004
    this.scene.add(sun)

    const violet = new THREE.PointLight(0x7c5cff, 60, 80)
    violet.position.set(-20, 10, -10)
    this.scene.add(violet)

    const cyan = new THREE.PointLight(0x23e5db, 50, 80)
    cyan.position.set(22, 10, 12)
    this.scene.add(cyan)
  }

  private readonly onCanvasPointerDown = () => {
    if (!this.started) this.start()
  }

  start() {
    if (this.started) return
    this.started = true
    this.input.setEnabled(true)
    this.opts.onTelemetry({ started: true })
  }

  stop() {
    this.started = false
    this.input.setEnabled(false)
    this.opts.onTelemetry({ started: false })
  }

  private readonly onResize = () => {
    const parent = this.renderer.domElement.parentElement
    const w = parent?.clientWidth || window.innerWidth
    const h = parent?.clientHeight || window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  private readonly loop = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.update(dt)
    this.renderer.render(this.scene, this.camera)
  }

  private update(dt: number) {
    const elapsed = this.clock.elapsedTime

    // Auto-enter drive mode when a movement key is pressed while the hero is in
    // view (guarded so arrow/space scrolling further down the page is unaffected).
    if (!this.started) {
      const s = this.input.getState()
      const active = s.throttle !== 0 || s.steer !== 0 || s.brake
      const heroInView = window.scrollY < window.innerHeight * 0.6
      if (active && heroInView) this.start()
    }

    if (this.started) {
      this.car.update(dt, this.input.getState())
    }

    // Fixed-step physics.
    this.accumulator += dt
    const step = this.rapierWorld.timestep
    let guard = 0
    while (this.accumulator >= step && guard < 5) {
      this.rapierWorld.step()
      this.accumulator -= step
      guard++
    }

    this.car.syncMesh()
    this.world.update(dt, elapsed)

    if (this.started) {
      this.updateFollowCamera(dt)
      this.updateProximityAndScore(dt)
    } else {
      this.updateIntroCamera(dt)
    }
  }

  private updateIntroCamera(dt: number) {
    if (!this.opts.reducedMotion) this.introAngle += dt * 0.18
    const r = 30
    this.camera.position.set(
      Math.cos(this.introAngle) * r,
      18,
      Math.sin(this.introAngle) * r,
    )
    this.camera.lookAt(0, 2, 0)
  }

  private updateFollowCamera(dt: number) {
    const carPos = this.car.position
    _fwd.set(0, 0, -1).applyQuaternion(this.car.mesh.quaternion).setY(0).normalize()
    _desired
      .copy(carPos)
      .addScaledVector(_fwd, -9)
      .add(new THREE.Vector3(0, 5.2, 0))

    const lerp = 1 - Math.exp(-6 * dt)
    this.camera.position.lerp(_desired, lerp)
    this.camera.lookAt(carPos.x, carPos.y + 1.2, carPos.z)
  }

  private updateProximityAndScore(dt: number) {
    const carPos = this.car.position

    // Nearest section within its radius.
    let nearest: string | null = null
    let nearestDist = Infinity
    for (const b of this.world.billboards) {
      const d = carPos.distanceTo(b.position)
      if (d < b.radius && d < nearestDist) {
        nearest = b.id
        nearestDist = d
      }
    }
    if (nearest !== this.activeSectionId) {
      this.activeSectionId = nearest
      this.opts.onTelemetry({ activeSectionId: nearest })
    }

    // Coins.
    const gained = this.world.collectCoinsNear(carPos)
    if (gained > 0) {
      this.score += gained
      this.opts.onTelemetry({ score: this.score })
    }

    // Throttled speed updates.
    this.telemetryTimer += dt
    if (this.telemetryTimer >= 0.12) {
      this.telemetryTimer = 0
      this.opts.onTelemetry({ speedKmh: Math.round(this.car.speedKmh) })
    }
  }

  /** Programmatic input for on-screen touch controls. */
  press(action: import('./input').InputAction) {
    this.input.press(action)
  }

  release(action: import('./input').InputAction) {
    this.input.release(action)
  }

  resetCar() {
    this.car.resetTo(0, 8)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.renderer.domElement.removeEventListener('pointerdown', this.onCanvasPointerDown)
    this.input.detach()

    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.geometry) mesh.geometry.dispose()
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat?.dispose()
    })
    this.renderer.dispose()
    this.rapierWorld?.free()
  }
}
