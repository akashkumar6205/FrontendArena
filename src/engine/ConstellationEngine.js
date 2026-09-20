import * as THREE from 'three'
import gsap from 'gsap'
import { TYPE_COLORS_INT } from '../constants/theme'

/**
 * ConstellationEngine encapsulates the pure Three.js 3D WebGL rendering engine.
 * Decoupled from React UI components, managing the scene, camera, lights,
 * particle starfield, nodes, connection lines, raycaster hover detection,
 * mouse orbit drag physics, and smooth camera transitions.
 */
export class ConstellationEngine {
  /**
   * @param {HTMLElement} container - DOM element to attach the WebGL canvas to
   * @param {Object} options
   * @param {Function} [options.onHover] - Callback invoked when a node is hovered or unhovered
   * @param {Function} [options.onSelect] - Callback invoked when a node is clicked
   */
  constructor(container, options = {}) {
    this.container = container
    this.options = options
    this.onHoverCallback = options.onHover || null
    this.onSelectCallback = options.onSelect || null

    // Three.js Core Objects
    this.scene = null
    this.camera = null
    this.renderer = null
    this.nodesGroup = null
    this.linesGroup = null
    this.starsGroup = null
    this.clock = new THREE.Clock()
    this.animationFrameId = null

    // Raycasting & Interaction State
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2(-9999, -9999)
    this.hoveredMesh = null
    this.isDragging = false
    this.prevMousePos = { x: 0, y: 0 }
    this.rotationVelocity = { x: 0.001, y: 0.002 }

    // Active Data Cache
    this.activeReceipts = []
    this.connections = []
    this.isDestroyed = false

    // Resize Observer
    this.resizeObserver = null

    this.init()
  }

  /**
   * Initialize Three.js scene, camera, lights, and starfield.
   */
  init() {
    if (!this.container) return

    const width = this.container.clientWidth || 800
    const height = this.container.clientHeight || 420

    // 1. Scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x08090a, 0.0018)

    // 2. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1500)
    this.camera.position.set(0, 0, 320)

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)

    // Clean previous elements in container & attach canvas
    this.container.innerHTML = ''
    this.container.appendChild(this.renderer.domElement)

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x10b981, 2, 500)
    pointLight1.position.set(100, 150, 200)
    this.scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 500)
    pointLight2.position.set(-150, -100, 150)
    this.scene.add(pointLight2)

    // 5. Starfield Particle System
    this.initStarfield()

    // 6. Groups for Nodes and Links
    this.nodesGroup = new THREE.Group()
    this.scene.add(this.nodesGroup)

    this.linesGroup = new THREE.Group()
    this.scene.add(this.linesGroup)

    // 7. Setup Resize Monitoring
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.handleResize())
      this.resizeObserver.observe(this.container)
    }

    // 8. Start Rendering Loop
    this.startAnimationLoop()
  }

  /**
   * Initializes ambient 3D celestial starfield particles.
   */
  initStarfield() {
    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 350
    const starPositions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 1000
      starPositions[i + 1] = (Math.random() - 0.5) * 800
      starPositions[i + 2] = (Math.random() - 0.5) * 800 - 100
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    })

    this.starsGroup = new THREE.Points(starsGeometry, starsMaterial)
    this.scene.add(this.starsGroup)
  }

  /**
   * Rebuilds 3D celestial sphere nodes and dynamic connection lines.
   *
   * @param {Array<Object>} receipts
   * @param {Array<Object>} connections
   */
  updateData({ receipts = [], connections = [] }) {
    if (this.isDestroyed || !this.nodesGroup || !this.linesGroup) return

    this.activeReceipts = receipts
    this.connections = connections

    // Clear previous node meshes
    while (this.nodesGroup.children.length > 0) {
      const obj = this.nodesGroup.children[0]
      this.nodesGroup.remove(obj)
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    }

    // Clear previous line meshes
    while (this.linesGroup.children.length > 0) {
      const obj = this.linesGroup.children[0]
      this.linesGroup.remove(obj)
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    }

    if (receipts.length === 0) return

    // Position nodes using golden ratio 3D spherical phyllotaxis arrangement
    const nodeCoords = {}
    const sphereRadius = 140
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden ratio angle

    receipts.forEach((receipt, idx) => {
      const y = 1 - (idx / Math.max(receipts.length - 1, 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * idx

      const x = Math.cos(theta) * radiusAtY * sphereRadius
      const z = Math.sin(theta) * radiusAtY * sphereRadius
      const posY = y * (sphereRadius * 0.75)

      nodeCoords[receipt.id] = new THREE.Vector3(x, posY, z)

      const hexColor = TYPE_COLORS_INT[receipt.type] || 0x10b981

      // 3D Sphere mesh for node
      const geometry = new THREE.SphereGeometry(receipt.type === 'moment' ? 6.5 : 5, 24, 24)
      const material = new THREE.MeshStandardMaterial({
        color: hexColor,
        emissive: hexColor,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, posY, z)
      mesh.userData = { receipt }

      // Outer glow wireframe ring for selected/special nodes
      const ringGeom = new THREE.RingGeometry(6.5, 7.8, 20)
      const ringMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      })
      const ring = new THREE.Mesh(ringGeom, ringMat)
      mesh.add(ring)

      this.nodesGroup.add(mesh)

      // GSAP smooth entrance scale
      gsap.fromTo(
        mesh.scale,
        { x: 0.01, y: 0.01, z: 0.01 },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.8,
          delay: idx * 0.02,
          ease: 'elastic.out(1, 0.5)'
        }
      )
    })

    // Construct 3D Connection Lines
    const linePositions = []
    const lineColors = []

    connections.forEach(conn => {
      const p1 = nodeCoords[conn.source]
      const p2 = nodeCoords[conn.target]

      if (p1 && p2) {
        linePositions.push(p1.x, p1.y, p1.z)
        linePositions.push(p2.x, p2.y, p2.z)

        const c = conn.score >= 6 ? new THREE.Color(0x10b981) : new THREE.Color(0x475569)
        lineColors.push(c.r, c.g, c.b)
        lineColors.push(c.r, c.g, c.b)
      }
    })

    if (linePositions.length > 0) {
      const linesGeometry = new THREE.BufferGeometry()
      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
      linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))

      const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      })

      const lineSegments = new THREE.LineSegments(linesGeometry, linesMaterial)
      this.linesGroup.add(lineSegments)
    }
  }

  /**
   * Main animation loop rendering the scene with orbital rotation and raycasting.
   */
  startAnimationLoop() {
    const animate = () => {
      if (this.isDestroyed) return
      this.animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = this.clock.getElapsedTime()

      // Auto-rotation when not user-dragging
      if (!this.isDragging && this.nodesGroup && this.linesGroup) {
        this.nodesGroup.rotation.y += this.rotationVelocity.y
        this.nodesGroup.rotation.x += this.rotationVelocity.x
        this.linesGroup.rotation.y += this.rotationVelocity.y
        this.linesGroup.rotation.x += this.rotationVelocity.x
      }

      // Ambient Starfield drift
      if (this.starsGroup) {
        this.starsGroup.rotation.y = elapsedTime * 0.02
      }

      // Raycasting Hover Detection
      if (this.camera && this.nodesGroup) {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.nodesGroup.children, true)

        if (intersects.length > 0) {
          let hitMesh = intersects[0].object
          while (hitMesh.parent && hitMesh.parent !== this.nodesGroup) {
            hitMesh = hitMesh.parent
          }

          if (this.hoveredMesh !== hitMesh) {
            // Unhover previous
            if (this.hoveredMesh && this.hoveredMesh.material) {
              gsap.to(this.hoveredMesh.scale, { x: 1, y: 1, z: 1, duration: 0.25, ease: 'power2.out' })
              gsap.to(this.hoveredMesh.material, { emissiveIntensity: 0.5, duration: 0.25 })
            }

            // Hover new node
            this.hoveredMesh = hitMesh
            if (hitMesh && hitMesh.material) {
              gsap.to(hitMesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, ease: 'back.out(2)' })
              gsap.to(hitMesh.material, { emissiveIntensity: 1.4, duration: 0.3 })
            }

            if (this.onHoverCallback && hitMesh.userData?.receipt) {
              this.onHoverCallback(hitMesh.userData.receipt)
            }
          }
        } else {
          if (this.hoveredMesh) {
            if (this.hoveredMesh.material) {
              gsap.to(this.hoveredMesh.scale, { x: 1, y: 1, z: 1, duration: 0.25, ease: 'power2.out' })
              gsap.to(this.hoveredMesh.material, { emissiveIntensity: 0.5, duration: 0.25 })
            }
            this.hoveredMesh = null
            if (this.onHoverCallback) {
              this.onHoverCallback(null)
            }
          }
        }
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    }

    animate()
  }

  /**
   * Translates pointer coordinates to normalized device coordinates (NDC)
   * and handles orbit drag physics.
   */
  handlePointerMove(clientX, clientY) {
    if (!this.container || this.isDestroyed) return
    const rect = this.container.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 2 - 1
    const y = -((clientY - rect.top) / rect.height) * 2 + 1
    this.mouse.set(x, y)

    if (this.isDragging && this.nodesGroup && this.linesGroup) {
      const deltaX = clientX - this.prevMousePos.x
      const deltaY = clientY - this.prevMousePos.y

      this.nodesGroup.rotation.y += deltaX * 0.006
      this.nodesGroup.rotation.x += deltaY * 0.006
      this.linesGroup.rotation.y += deltaX * 0.006
      this.linesGroup.rotation.x += deltaY * 0.006

      this.prevMousePos = { x: clientX, y: clientY }
    }
  }

  handlePointerDown(clientX, clientY) {
    this.isDragging = true
    this.prevMousePos = { x: clientX, y: clientY }
  }

  handlePointerUp() {
    this.isDragging = false
  }

  /**
   * Handles click selection with GSAP camera fly-to animation.
   */
  handleClick(clientX, clientY) {
    if (!this.camera || !this.nodesGroup || this.isDestroyed) return
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.nodesGroup.children, true)

    if (intersects.length > 0) {
      let hitMesh = intersects[0].object
      while (hitMesh.parent && hitMesh.parent !== this.nodesGroup) {
        hitMesh = hitMesh.parent
      }

      const receipt = hitMesh.userData?.receipt
      if (receipt) {
        const targetPos = hitMesh.position.clone()
        gsap.to(this.camera.position, {
          x: targetPos.x * 0.6,
          y: targetPos.y * 0.6,
          z: targetPos.z + 140,
          duration: 1.2,
          ease: 'power3.inOut'
        })

        if (this.onSelectCallback) {
          this.onSelectCallback(receipt)
        }
      }
    }
  }

  /**
   * Resets camera and group rotations back to center.
   */
  resetCamera() {
    if (!this.camera || !this.nodesGroup || !this.linesGroup || this.isDestroyed) return
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 320,
      duration: 1.2,
      ease: 'power2.out'
    })
    gsap.to(this.nodesGroup.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power2.out' })
    gsap.to(this.linesGroup.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power2.out' })
  }

  /**
   * Zooms camera along Z-axis.
   * @param {'in' | 'out'} direction
   */
  zoom(direction) {
    if (!this.camera || this.isDestroyed) return
    const targetZ = Math.max(120, Math.min(500, this.camera.position.z + (direction === 'in' ? -60 : 60)))
    gsap.to(this.camera.position, { z: targetZ, duration: 0.6, ease: 'power2.out' })
  }

  /**
   * Resizes renderer and camera projection upon viewport change.
   */
  handleResize() {
    if (!this.container || !this.renderer || !this.camera || this.isDestroyed) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (width === 0 || height === 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * Cleanly destroys and disposes all WebGL and Three.js resources.
   */
  dispose() {
    this.isDestroyed = true

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    if (this.nodesGroup) {
      while (this.nodesGroup.children.length > 0) {
        const obj = this.nodesGroup.children[0]
        this.nodesGroup.remove(obj)
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      }
    }

    if (this.linesGroup) {
      while (this.linesGroup.children.length > 0) {
        const obj = this.linesGroup.children[0]
        this.linesGroup.remove(obj)
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      }
    }

    if (this.starsGroup) {
      if (this.starsGroup.geometry) this.starsGroup.geometry.dispose()
      if (this.starsGroup.material) this.starsGroup.material.dispose()
    }

    if (this.renderer) {
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
      }
      this.renderer.dispose()
    }

    this.scene = null
    this.camera = null
    this.renderer = null
  }
}
