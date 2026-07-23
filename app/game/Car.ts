// =============================================================================
// Arcade-physics car. Uses a Rapier dynamic body with X/Z rotation locked
// (only yaw) so it never flips — predictable, fun, and robust. Movement is
// velocity-shaped rather than force-based for stable, framerate-independent
// handling. The visual mesh is synced to the physics body each frame.
// =============================================================================
import * as THREE from 'three'
import type RAPIER from '@dimforge/rapier3d-compat'
import type { InputState } from './input'

const FORWARD = new THREE.Vector3(0, 0, -1)

// Scratch objects (avoid per-frame allocations).
const _q = new THREE.Quaternion()
const _fwd = new THREE.Vector3()
const _vel = new THREE.Vector3()
const _lat = new THREE.Vector3()

function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) return Math.min(current + maxDelta, target)
  if (current > target) return Math.max(current - maxDelta, target)
  return target
}

export class Car {
  readonly mesh: THREE.Group
  readonly body: RAPIER.RigidBody

  // Tunables (SI-ish units).
  private readonly maxSpeed = 30 // m/s forward (~108 km/h)
  private readonly boostMul = 1.6
  private readonly accel = 16 // m/s^2
  private readonly brakeDecel = 34
  private readonly reverseFactor = 0.45
  private readonly turnRate = 2.6 // rad/s at speed
  private readonly grip = 0.12 // 0..1 lateral velocity kept per frame-ish

  private wheels: THREE.Object3D[] = []
  private frontWheels: THREE.Object3D[] = []
  // Internal longitudinal speed (m/s). Kept in code rather than re-read from the
  // body each frame, so ground friction can't reset acceleration.
  private speed = 0

  constructor(
    private readonly rapier: typeof RAPIER,
    private readonly world: RAPIER.World,
    spawn = new THREE.Vector3(0, 1.4, 8),
  ) {
    this.mesh = this.buildMesh()

    const bodyDesc = rapier.RigidBodyDesc.dynamic()
      .setTranslation(spawn.x, spawn.y, spawn.z)
      .setLinearDamping(0.15)
      .setAngularDamping(6)
      .enabledRotations(false, true, false)
      .setCanSleep(false)
    this.body = world.createRigidBody(bodyDesc)

    // Low friction: the car is velocity-driven, so high ground friction would
    // fight the imposed velocity and stall it. Grip is handled in code instead.
    const colliderDesc = rapier.ColliderDesc.cuboid(0.9, 0.4, 1.7)
      .setDensity(4)
      .setFriction(0.2)
      .setRestitution(0.05)
    world.createCollider(colliderDesc, this.body)
  }

  private buildMesh(): THREE.Group {
    const group = new THREE.Group()

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xc6ff3d,
      metalness: 0.4,
      roughness: 0.35,
    })
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0e1422,
      metalness: 0.2,
      roughness: 0.4,
    })
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d15,
      metalness: 0.1,
      roughness: 0.7,
    })

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d15,
      metalness: 0.2,
      roughness: 0.08,
    })
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff4d6,
      emissiveIntensity: 1.4,
    })
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0x330000,
      emissive: 0xff2222,
      emissiveIntensity: 1.2,
    })

    // Lower skirt + main body (two tiers for a sleeker silhouette).
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.3, 3.3), cabinMat)
    skirt.position.y = -0.05
    skirt.castShadow = true
    group.add(skirt)

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 3.4), bodyMat)
    body.position.y = 0.22
    body.castShadow = true
    group.add(body)

    const nose = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.28, 0.6), bodyMat)
    nose.position.set(0, 0.1, -1.7)
    nose.castShadow = true
    group.add(nose)

    // Greenhouse / cabin + glass.
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.5, 1.7), cabinMat)
    cabin.position.set(0, 0.66, -0.1)
    cabin.castShadow = true
    group.add(cabin)

    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.42, 1.55), glassMat)
    glass.position.set(0, 0.68, -0.1)
    group.add(glass)

    // Lights.
    for (const side of [-0.6, 0.6]) {
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.08), headMat)
      head.position.set(side, 0.2, -1.99)
      group.add(head)

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.08), tailMat)
      tail.position.set(side, 0.3, 1.72)
      group.add(tail)
    }

    // Rear spoiler.
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.4), cabinMat)
    spoiler.position.set(0, 0.62, 1.5)
    spoiler.castShadow = true
    group.add(spoiler)
    for (const side of [-0.65, 0.65]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), cabinMat)
      strut.position.set(side, 0.5, 1.5)
      group.add(strut)
    }

    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 18)
    const offsets: Array<[number, number, boolean]> = [
      [0.95, 1.1, true],
      [-0.95, 1.1, true],
      [0.95, -1.2, false],
      [-0.95, -1.2, false],
    ]
    for (const [x, z, isFront] of offsets) {
      const pivot = new THREE.Object3D()
      pivot.position.set(x, -0.2, z)
      const wheel = new THREE.Mesh(wheelGeo, wheelMat)
      wheel.rotation.z = Math.PI / 2
      wheel.castShadow = true
      pivot.add(wheel)
      group.add(pivot)
      this.wheels.push(wheel)
      if (isFront) this.frontWheels.push(pivot)
    }

    return group
  }

  update(dt: number, input: InputState) {
    const rot = this.body.rotation()
    _q.set(rot.x, rot.y, rot.z, rot.w)
    _fwd.copy(FORWARD).applyQuaternion(_q).setY(0).normalize()

    const lv = this.body.linvel()
    _vel.set(lv.x, lv.y, lv.z)

    // Measured forward speed is used ONLY to compute sideways slip for grip.
    const measured = _vel.dot(_fwd)
    _lat.copy(_vel).setY(0).addScaledVector(_fwd, -measured)
    _lat.multiplyScalar(this.grip)

    // Target forward speed from throttle / brake.
    let targetSpeed: number
    let rate: number
    if (input.brake) {
      targetSpeed = 0
      rate = this.brakeDecel
    } else if (input.throttle > 0) {
      targetSpeed = this.maxSpeed * (input.boost ? this.boostMul : 1)
      rate = this.accel
    } else if (input.throttle < 0) {
      targetSpeed = -this.maxSpeed * this.reverseFactor
      rate = this.accel
    } else {
      targetSpeed = 0
      rate = this.accel * 0.5 // coast / engine braking
    }

    // Integrate our own speed toward the target (immune to friction reset).
    this.speed = approach(this.speed, targetSpeed, rate * dt)

    // Compose new horizontal velocity (keep vertical for gravity/ramps).
    const vx = _fwd.x * this.speed + _lat.x
    const vz = _fwd.z * this.speed + _lat.z
    this.body.setLinvel({ x: vx, y: lv.y, z: vz }, true)

    // Steering — scales with speed and reverses when going backwards.
    const speedFactor = Math.min(Math.abs(this.speed) / 5, 1)
    const dir = this.speed >= 0 ? 1 : -1
    const yawRate = -input.steer * this.turnRate * speedFactor * dir
    this.body.setAngvel({ x: 0, y: yawRate, z: 0 }, true)

    this.animateWheels(dt, input.steer)
  }

  /** Sync the visual mesh to the physics body. Call AFTER stepping physics. */
  syncMesh() {
    const t = this.body.translation()
    const r = this.body.rotation()
    this.mesh.position.set(t.x, t.y, t.z)
    this.mesh.quaternion.set(r.x, r.y, r.z, r.w)
  }

  private animateWheels(dt: number, steer: number) {
    const spin = (this.speed / 0.45) * dt
    for (const wheel of this.wheels) wheel.rotation.x -= spin
    const targetSteer = steer * 0.5
    for (const pivot of this.frontWheels) {
      pivot.rotation.y += (targetSteer - pivot.rotation.y) * 0.2
    }
  }

  get speedKmh(): number {
    return Math.abs(this.speed) * 3.6
  }

  get position(): THREE.Vector3 {
    const t = this.body.translation()
    return new THREE.Vector3(t.x, t.y, t.z)
  }

  resetTo(x: number, z: number) {
    this.speed = 0
    this.body.setTranslation({ x, y: 1.4, z }, true)
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }
}
