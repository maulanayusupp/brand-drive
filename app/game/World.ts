// =============================================================================
// The 3D city: asphalt ground, a grid of window-lit buildings (with colliders
// forming streets), an open central plaza with ramps and knock-around crates,
// the service billboards, and collectible "lead" coins. Owns both the
// Three.js meshes and their Rapier colliders and syncs them each frame.
// =============================================================================
import * as THREE from 'three'
import type RAPIER from '@dimforge/rapier3d-compat'
import { createBillboardTexture } from './textTexture'
import { createWindowTexture } from './cityTextures'

export interface SectionSpec {
  id: string
  title: string
  subtitle: string
  accent: string
  icon: string
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

const PLAZA = 34 // open radius (no buildings) around the centre
const BOUNDARY = 150

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
    this.buildCity()
    this.buildBoundary()
    this.buildRamps()
    this.buildCrates()
    for (const spec of sections) this.buildBillboard(spec)
    this.buildCoins(sections)
  }

  /** Stable pseudo-random in [0,1) from two ints — deterministic city layout. */
  private hash(a: number, b: number): number {
    const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
    return s - Math.floor(s)
  }

  // --- Ground ---------------------------------------------------------------
  private buildGround() {
    const geo = new THREE.PlaneGeometry(600, 600)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x090c14,
      metalness: 0.15,
      roughness: 0.9,
    })
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    // Street grid
    const grid = new THREE.GridHelper(360, 120, 0x1e2c48, 0x121a2c)
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.4
    grid.position.y = 0.01
    this.scene.add(grid)

    const body = this.world.createRigidBody(
      this.rapier.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0),
    )
    this.world.createCollider(
      this.rapier.ColliderDesc.cuboid(300, 0.5, 300).setFriction(1),
      body,
    )
  }

  // --- City buildings (shops + towers with storefronts) ---------------------
  private buildCity() {
    const winTex = createWindowTexture(7)
    const towerMats = [0x0e1626, 0x141026, 0x0c1a1e].map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          metalness: 0.1,
          map: winTex,
          emissive: 0xffffff,
          emissiveMap: winTex,
          emissiveIntensity: 0.5,
        }),
    )
    const shopMats = [0x161b2b, 0x1b1622, 0x14201f].map(
      (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.1 }),
    )
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0a0d15,
      metalness: 0.2,
      roughness: 0.08,
    })
    const propMat = new THREE.MeshStandardMaterial({ color: 0x0b1020, roughness: 0.9 })
    const signColors = [0xc6ff3d, 0x23e5db, 0x7c5cff, 0xff6b6b, 0xffcf5c, 0xff8a3d, 0x4ad3ff]

    const step = 30
    for (let gx = -3; gx <= 3; gx++) {
      for (let gz = -3; gz <= 3; gz++) {
        const x = gx * step
        const z = gz * step
        if (Math.abs(x) < PLAZA && Math.abs(z) < PLAZA) continue // open plaza
        if (this.hash(gx, gz) < 0.1) continue // occasional empty lot

        const isTower = this.hash(gx + 2, gz - 1) > 0.5
        let fw = 12 + this.hash(gx - 3, gz + 5) * 6
        let fd = 12 + this.hash(gx + 4, gz + 9) * 6
        let height: number
        if (isTower) {
          height = 18 + Math.floor(this.hash(gx + 10, gz - 7) * 28)
        } else {
          height = 5 + Math.floor(this.hash(gx + 10, gz - 7) * 4)
          fw += 3
          fd += 2
        }

        const jx = (this.hash(gx + 7, gz) * 2 - 1) * 2.5
        const jz = (this.hash(gx, gz + 7) * 2 - 1) * 2.5
        const px = x + jx
        const pz = z + jz

        const group = new THREE.Group()
        group.position.set(px, 0, pz)

        const bodyMat = isTower
          ? towerMats[Math.floor(this.hash(gx + 1, gz + 1) * towerMats.length)]
          : shopMats[Math.floor(this.hash(gx + 1, gz + 1) * shopMats.length)]
        const main = new THREE.Mesh(new THREE.BoxGeometry(fw, height, fd), bodyMat)
        main.position.y = height / 2
        main.receiveShadow = true
        group.add(main)

        // Storefront on the face pointing toward the city centre (streets).
        const signColor = signColors[Math.floor(this.hash(gx + 5, gz + 3) * signColors.length)]
        const signMat = new THREE.MeshStandardMaterial({
          color: signColor,
          emissive: signColor,
          emissiveIntensity: 0.9,
          roughness: 0.5,
        })
        const awningMat = new THREE.MeshStandardMaterial({ color: signColor, roughness: 0.6 })

        const alongX = Math.abs(px) >= Math.abs(pz)
        if (alongX) {
          const sgn = px >= 0 ? -1 : 1
          const fx = sgn * (fw / 2)
          const span = fd * 0.82
          const glass = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.2, span), glassMat)
          glass.position.set(fx, 1.15, 0)
          group.add(glass)
          const awning = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, fd * 0.86), awningMat)
          awning.position.set(fx + sgn * 0.7, 2.55, 0)
          group.add(awning)
          const sign = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.7, fd * 0.7), signMat)
          sign.position.set(fx + sgn * 0.06, 3.15, 0)
          group.add(sign)
        } else {
          const sgn = pz >= 0 ? -1 : 1
          const fz = sgn * (fd / 2)
          const span = fw * 0.82
          const glass = new THREE.Mesh(new THREE.BoxGeometry(span, 2.2, 0.15), glassMat)
          glass.position.set(0, 1.15, fz)
          group.add(glass)
          const awning = new THREE.Mesh(new THREE.BoxGeometry(fw * 0.86, 0.22, 1.4), awningMat)
          awning.position.set(0, 2.55, fz + sgn * 0.7)
          group.add(awning)
          const sign = new THREE.Mesh(new THREE.BoxGeometry(fw * 0.7, 0.7, 0.14), signMat)
          sign.position.set(0, 3.15, fz + sgn * 0.06)
          group.add(sign)
        }

        // Rooftop props (AC units / tank / antenna).
        const props = 1 + Math.floor(this.hash(gx - 2, gz + 6) * 3)
        for (let i = 0; i < props; i++) {
          const ph = 0.6 + this.hash(gx + i, gz - i) * 1.6
          const prop = new THREE.Mesh(new THREE.BoxGeometry(1.2, ph, 1.2), propMat)
          prop.position.set(
            (this.hash(gx + i * 3, gz) * 2 - 1) * (fw / 2 - 1.5),
            height + ph / 2,
            (this.hash(gx, gz + i * 3) * 2 - 1) * (fd / 2 - 1.5),
          )
          group.add(prop)
        }

        this.scene.add(group)

        const body = this.world.createRigidBody(
          this.rapier.RigidBodyDesc.fixed().setTranslation(px, height / 2, pz),
        )
        this.world.createCollider(
          this.rapier.ColliderDesc.cuboid(fw / 2, height / 2, fd / 2),
          body,
        )
      }
    }
  }

  // --- Invisible boundary (keeps the car in the city) -----------------------
  private buildBoundary() {
    const specs: Array<[number, number, number, number]> = [
      [0, BOUNDARY, BOUNDARY * 2, 2],
      [0, -BOUNDARY, BOUNDARY * 2, 2],
      [BOUNDARY, 0, 2, BOUNDARY * 2],
      [-BOUNDARY, 0, 2, BOUNDARY * 2],
    ]
    for (const [x, z, sx, sz] of specs) {
      const body = this.world.createRigidBody(
        this.rapier.RigidBodyDesc.fixed().setTranslation(x, 5, z),
      )
      this.world.createCollider(
        this.rapier.ColliderDesc.cuboid(sx / 2, 5, sz / 2),
        body,
      )
    }
  }

  // --- Ramps (plaza) --------------------------------------------------------
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

  // --- Knock-around crates (plaza) ------------------------------------------
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
      [-4, 16],
      [2, 20],
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
        this.rapier.ColliderDesc.cuboid(0.6, 0.6, 0.6).setDensity(0.4).setFriction(0.6),
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

    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0e1422, metalness: 0.5, roughness: 0.4 }),
    )
    post.position.y = 2
    post.castShadow = true
    group.add(post)

    const texture = createBillboardTexture({
      title: spec.title,
      subtitle: spec.subtitle,
      accent: spec.accent,
      icon: spec.icon,
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

    group.lookAt(0, 0, 0)

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
    // Concentric rings spreading from the plaza into the streets.
    for (const [radius, count] of [
      [12, 16],
      [42, 24],
      [66, 28],
    ] as const) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2
        positions.push(new THREE.Vector3(Math.cos(a) * radius, 1, Math.sin(a) * radius))
      }
    }
    // Trails leading to each billboard.
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
    for (const crate of this.crates) {
      const t = crate.body.translation()
      const r = crate.body.rotation()
      crate.mesh.position.set(t.x, t.y, t.z)
      crate.mesh.quaternion.set(r.x, r.y, r.z, r.w)
    }
    for (const coin of this.coins) {
      if (coin.collected) continue
      coin.mesh.rotation.z += dt * 2.5
      coin.mesh.position.y = coin.position.y + Math.sin(elapsed * 2 + coin.position.x) * 0.15
    }
    const pulse = 0.28 + Math.sin(elapsed * 2) * 0.12
    for (const b of this.billboards) {
      ;(b.ring.material as THREE.MeshBasicMaterial).opacity = pulse
    }
  }

  /** Returns the number of coins newly collected near a position. */
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
