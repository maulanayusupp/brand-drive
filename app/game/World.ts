// =============================================================================
// The 3D world: ground, containment walls, ramps, knock-around crates, the
// section billboards, and collectible coins. Owns both the Three.js meshes and
// their Rapier colliders and keeps them in sync each frame.
// =============================================================================
import * as THREE from 'three'
import type RAPIER from '@dimforge/rapier3d-compat'
import { createBillboardTexture } from './textTexture'

export interface SectionSpec {
  id: string
  title: string
  subtitle: string
  accent: string
  x: number
  z: number
}

export interface Billboard {
  id: string
  position: THREE.Vector3
  radius: number
  ring: THREE.Mesh
  accent: THREE.Color
}

interface Crate {
  body: RAPIER.RigidBody
  mesh: THREE.Mesh
}

interface Coin {
  mesh: THREE.Mesh
  position: THREE.Vector3
  collected: boolean
}

const ARENA = 48

export class World {
  readonly billboards: Billboard[] = []
  readonly coins: Coin[] = []
  private readonly crates: Crate[] = []

  constructor(
    private readonly rapier: typeof RAPIER,
    private readonly world: RAPIER.World,
    private readonly scene: THREE.Scene,
    sections: SectionSpec[],
  ) {
    this.buildGround()
    this.buildWalls()
    this.buildRamps()
    this.buildCrates()
    for (const spec of sections) this.buildBillboard(spec)
    this.buildCoins(sections)
  }

  // --- Ground ---------------------------------------------------------------
  private buildGround() {
    const geo = new THREE.PlaneGeometry(400, 400)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0a0e18,
      metalness: 0.1,
      roughness: 0.95,
    })
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    const grid = new THREE.GridHelper(200, 80, 0x1b2740, 0x121a2c)
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.5
    grid.position.y = 0.01
    this.scene.add(grid)

    const body = this.world.createRigidBody(
      this.rapier.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0),
    )
    this.world.createCollider(
      this.rapier.ColliderDesc.cuboid(200, 0.5, 200).setFriction(1),
      body,
    )
  }

  // --- Containment walls ----------------------------------------------------
  private buildWalls() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x7c5cff,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.15,
      emissive: 0x2a1e66,
    })
    const specs: Array<[number, number, number, number]> = [
      [0, ARENA, ARENA * 2, 1],
      [0, -ARENA, ARENA * 2, 1],
      [ARENA, 0, 1, ARENA * 2],
      [-ARENA, 0, 1, ARENA * 2],
    ]
    for (const [x, z, sx, sz] of specs) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, 3, sz), mat)
      mesh.position.set(x, 1.5, z)
      this.scene.add(mesh)
      const body = this.world.createRigidBody(
        this.rapier.RigidBodyDesc.fixed().setTranslation(x, 1.5, z),
      )
      this.world.createCollider(
        this.rapier.ColliderDesc.cuboid(sx / 2, 1.5, sz / 2),
        body,
      )
    }
  }

  // --- Ramps ----------------------------------------------------------------
  private buildRamps() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x23e5db,
      metalness: 0.4,
      roughness: 0.5,
      emissive: 0x0a3d3a,
    })
    const ramps: Array<{ x: number; z: number; rotY: number }> = [
      { x: 8, z: 6, rotY: 0 },
      { x: -10, z: -4, rotY: Math.PI / 2 },
    ]
    for (const r of ramps) {
      const euler = new THREE.Euler(-Math.PI / 10, r.rotY, 0)
      const quat = new THREE.Quaternion().setFromEuler(euler)

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 5), mat)
      mesh.position.set(r.x, 0.6, r.z)
      mesh.quaternion.copy(quat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)

      const body = this.world.createRigidBody(
        this.rapier.RigidBodyDesc.fixed().setTranslation(r.x, 0.6, r.z),
      )
      this.world.createCollider(
        this.rapier.ColliderDesc.cuboid(3, 0.25, 2.5).setRotation({
          x: quat.x,
          y: quat.y,
          z: quat.z,
          w: quat.w,
        }),
        body,
      )
    }
  }

  // --- Knock-around crates --------------------------------------------------
  private buildCrates() {
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffcf5c,
      metalness: 0.2,
      roughness: 0.6,
    })
    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2)
    const positions: Array<[number, number]> = [
      [4, -10],
      [6, -12],
      [5, -14],
      [-14, 8],
      [-12, 10],
      [18, 12],
      [20, 10],
      [-4, 16],
      [2, 20],
      [-20, -12],
    ]
    for (const [x, z] of positions) {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)

      const body = this.world.createRigidBody(
        this.rapier.RigidBodyDesc.dynamic()
          .setTranslation(x, 0.7, z)
          .setLinearDamping(0.4)
          .setAngularDamping(0.4),
      )
      this.world.createCollider(
        this.rapier.ColliderDesc.cuboid(0.6, 0.6, 0.6)
          .setDensity(0.4)
          .setFriction(0.6),
        body,
      )
      this.crates.push({ body, mesh })
    }
  }

  // --- Section billboards ---------------------------------------------------
  private buildBillboard(spec: SectionSpec) {
    const accent = new THREE.Color(spec.accent)
    const group = new THREE.Group()
    group.position.set(spec.x, 0, spec.z)

    // Post
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0e1422, metalness: 0.5, roughness: 0.4 }),
    )
    post.position.y = 2
    post.castShadow = true
    group.add(post)

    // Panel
    const texture = createBillboardTexture({
      title: spec.title,
      subtitle: spec.subtitle,
      accent: spec.accent,
    })
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 3),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
    )
    panel.position.y = 5
    group.add(panel)

    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 3),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
    )
    back.position.y = 5
    back.rotation.y = Math.PI
    group.add(back)

    // Face the group toward the world origin so panels read from the arena.
    group.lookAt(0, 0, 0)

    // Glowing proximity ring on the ground.
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4.2, 5, 48),
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.set(spec.x, 0.05, spec.z)
    this.scene.add(ring)

    this.scene.add(group)
    this.billboards.push({
      id: spec.id,
      position: new THREE.Vector3(spec.x, 0, spec.z),
      radius: 6,
      ring,
      accent,
    })
  }

  // --- Coins ----------------------------------------------------------------
  private buildCoins(sections: SectionSpec[]) {
    const geo = new THREE.TorusGeometry(0.4, 0.16, 12, 24)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd24a,
      metalness: 0.8,
      roughness: 0.25,
      emissive: 0x5a4300,
    })

    const positions: THREE.Vector3[] = []
    // A ring of coins.
    const ringCount = 16
    for (let i = 0; i < ringCount; i++) {
      const a = (i / ringCount) * Math.PI * 2
      positions.push(new THREE.Vector3(Math.cos(a) * 12, 1, Math.sin(a) * 12))
    }
    // A trail leading to each billboard.
    for (const s of sections) {
      positions.push(new THREE.Vector3(s.x * 0.5, 1, s.z * 0.5))
      positions.push(new THREE.Vector3(s.x * 0.75, 1, s.z * 0.75))
    }

    for (const pos of positions) {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos)
      mesh.rotation.x = Math.PI / 2
      mesh.castShadow = true
      this.scene.add(mesh)
      this.coins.push({ mesh, position: pos.clone(), collected: false })
    }
  }

  // --- Per-frame ------------------------------------------------------------
  update(dt: number, elapsed: number) {
    // Sync crate meshes to physics.
    for (const crate of this.crates) {
      const t = crate.body.translation()
      const r = crate.body.rotation()
      crate.mesh.position.set(t.x, t.y, t.z)
      crate.mesh.quaternion.set(r.x, r.y, r.z, r.w)
    }
    // Spin + bob coins.
    for (const coin of this.coins) {
      if (coin.collected) continue
      coin.mesh.rotation.z += dt * 2.5
      coin.mesh.position.y = coin.position.y + Math.sin(elapsed * 2 + coin.position.x) * 0.15
    }
    // Pulse billboard rings.
    const pulse = 0.28 + Math.sin(elapsed * 2) * 0.12
    for (const b of this.billboards) {
      ;(b.ring.material as THREE.MeshBasicMaterial).opacity = pulse
    }
  }

  /** Returns the id of a newly collected coin, or null. */
  collectCoinsNear(position: THREE.Vector3, radius = 1.6): number {
    let collected = 0
    for (const coin of this.coins) {
      if (coin.collected) continue
      if (position.distanceTo(coin.position) < radius) {
        coin.collected = true
        coin.mesh.visible = false
        collected++
      }
    }
    return collected
  }
}
