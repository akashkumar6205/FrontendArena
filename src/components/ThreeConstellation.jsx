import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { Sparkles, RotateCcw, ZoomIn, ZoomOut, AlertCircle, RefreshCw } from 'lucide-react'
import { TYPE_COLORS_INT } from '../constants/theme'

/**
 * ThreeConstellation renders an interactive 3D WebGL galaxy of life receipts.
 * Supports mouse orbit drag, raycasting hover with GSAP scale and emission,
 * smooth camera fly-to on node click, and loading/empty/error states.
 */
export function ThreeConstellation({
  receipts = [],
  connections = [],
  onSelectReceipt,
  onOpenGraph
}) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const nodesGroupRef = useRef(null)
  const linesGroupRef = useRef(null)
  const starsGroupRef = useRef(null)
  const animationFrameIdRef = useRef(null)
  
  // Interactive Raycasting refs
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2(-9999, -9999))
  const hoveredMeshRef = useRef(null)
  const isDraggingRef = useRef(false)
  const prevMousePosRef = useRef({ x: 0, y: 0 })
  const rotationVelocityRef = useRef({ x: 0.001, y: 0.002 })

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [webglError, setWebglError] = useState(null)
  const [hoveredData, setHoveredData] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Available filters
  const filterCategories = ['all', 'music', 'purchase', 'place', 'note', 'expense']

  // Filtered dataset for constellation
  const activeReceipts = React.useMemo(() => {
    if (selectedFilter === 'all') return receipts.slice(0, 32)
    return receipts.filter(r => r.type === selectedFilter || r.category?.toLowerCase() === selectedFilter).slice(0, 32)
  }, [receipts, selectedFilter])

  // Initialize Three.js Scene
  const initThree = useCallback(() => {
    if (!mountRef.current) return

    try {
      setIsLoading(true)
      setWebglError(null)

      const width = mountRef.current.clientWidth || 800
      const height = mountRef.current.clientHeight || 420

      // 1. Scene
      const scene = new THREE.Scene()
      sceneRef.current = scene
      scene.fog = new THREE.FogExp2(0x08090a, 0.0018)

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1500)
      camera.position.set(0, 0, 320)
      cameraRef.current = camera

      // 3. WebGL Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      rendererRef.current = renderer

      // Clear previous canvas if any
      mountRef.current.innerHTML = ''
      mountRef.current.appendChild(renderer.domElement)

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambientLight)

      const pointLight1 = new THREE.PointLight(0x10b981, 2, 500)
      pointLight1.position.set(100, 150, 200)
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 500)
      pointLight2.position.set(-150, -100, 150)
      scene.add(pointLight2)

      // 5. Starfield Background Particle System
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
      const starField = new THREE.Points(starsGeometry, starsMaterial)
      starsGroupRef.current = starField
      scene.add(starField)

      // 6. Node and Lines Groups
      const nodesGroup = new THREE.Group()
      nodesGroupRef.current = nodesGroup
      scene.add(nodesGroup)

      const linesGroup = new THREE.Group()
      linesGroupRef.current = linesGroup
      scene.add(linesGroup)

      // Done loading scene structure
      setTimeout(() => setIsLoading(false), 250)

    } catch (err) {
      console.error('WebGL Initialization Error:', err)
      setWebglError('Unable to initialize WebGL context. Please check hardware acceleration or browser compatibility.')
      setIsLoading(false)
    }
  }, [])

  // Build / Update 3D Nodes & Connection Lines
  const buildConstellation = useCallback(() => {
    if (!nodesGroupRef.current || !linesGroupRef.current || !sceneRef.current) return

    const nodesGroup = nodesGroupRef.current
    const linesGroup = linesGroupRef.current

    // Clean up existing meshes
    while (nodesGroup.children.length > 0) {
      const obj = nodesGroup.children[0]
      nodesGroup.remove(obj)
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    }

    while (linesGroup.children.length > 0) {
      const obj = linesGroup.children[0]
      linesGroup.remove(obj)
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    }

    if (activeReceipts.length === 0) return

    // Position nodes on spherical / phyllotaxis 3D galaxy arrangement
    const nodeCoords = {}
    const sphereRadius = 140
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden ratio angle

    activeReceipts.forEach((receipt, idx) => {
      const y = 1 - (idx / Math.max(activeReceipts.length - 1, 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * idx

      const x = Math.cos(theta) * radiusAtY * sphereRadius
      const z = Math.sin(theta) * radiusAtY * sphereRadius
      const posY = y * (sphereRadius * 0.75)

      nodeCoords[receipt.id] = new THREE.Vector3(x, posY, z)

      // Color based on receipt type
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

      nodesGroup.add(mesh)

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
      linesGroup.add(lineSegments)
    }
  }, [activeReceipts, connections])

  // Mount Three.js
  useEffect(() => {
    initThree()
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose()
      }
    }
  }, [initThree])

  // Rebuild constellation when dataset or filter changes
  useEffect(() => {
    if (!isLoading && !webglError) {
      buildConstellation()
    }
  }, [buildConstellation, isLoading, webglError])

  // Animation Loop with Gentle Auto-Rotation & Hover Raycasting
  useEffect(() => {
    if (isLoading || webglError) return

    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Auto-rotation when not dragging
      if (!isDraggingRef.current && nodesGroupRef.current && linesGroupRef.current) {
        nodesGroupRef.current.rotation.y += rotationVelocityRef.current.y
        nodesGroupRef.current.rotation.x += rotationVelocityRef.current.x
        linesGroupRef.current.rotation.y += rotationVelocityRef.current.y
        linesGroupRef.current.rotation.x += rotationVelocityRef.current.x
      }

      // Gentle Starfield float
      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y = elapsedTime * 0.02
      }

      // Raycasting for Hover Detection
      if (cameraRef.current && nodesGroupRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
        const intersects = raycasterRef.current.intersectObjects(nodesGroupRef.current.children, true)

        if (intersects.length > 0) {
          // Find root node mesh
          let hitMesh = intersects[0].object
          while (hitMesh.parent && hitMesh.parent !== nodesGroupRef.current) {
            hitMesh = hitMesh.parent
          }

          if (hoveredMeshRef.current !== hitMesh) {
            // Unhover previous
            if (hoveredMeshRef.current && hoveredMeshRef.current.material) {
              gsap.to(hoveredMeshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.25, ease: 'power2.out' })
              gsap.to(hoveredMeshRef.current.material, { emissiveIntensity: 0.5, duration: 0.25 })
            }

            // Hover new node
            hoveredMeshRef.current = hitMesh
            if (hitMesh && hitMesh.material) {
              gsap.to(hitMesh.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3, ease: 'back.out(2)' })
              gsap.to(hitMesh.material, { emissiveIntensity: 1.4, duration: 0.3 })
            }

            if (hitMesh.userData?.receipt) {
              setHoveredData(hitMesh.userData.receipt)
            }
          }
        } else {
          // Mouse off any node
          if (hoveredMeshRef.current) {
            if (hoveredMeshRef.current.material) {
              gsap.to(hoveredMeshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.25, ease: 'power2.out' })
              gsap.to(hoveredMeshRef.current.material, { emissiveIntensity: 0.5, duration: 0.25 })
            }
            hoveredMeshRef.current = null
            setHoveredData(null)
          }
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [isLoading, webglError])

  // Mouse / Pointer Event Listeners for Hover, Drag & Click
  const handlePointerMove = (e) => {
    if (!mountRef.current) return
    const rect = mountRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    mouseRef.current.set(x, y)

    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })

    // Drag rotate
    if (isDraggingRef.current && nodesGroupRef.current && linesGroupRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x
      const deltaY = e.clientY - prevMousePosRef.current.y

      nodesGroupRef.current.rotation.y += deltaX * 0.006
      nodesGroupRef.current.rotation.x += deltaY * 0.006
      linesGroupRef.current.rotation.y += deltaX * 0.006
      linesGroupRef.current.rotation.x += deltaY * 0.006

      prevMousePosRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handlePointerDown = (e) => {
    isDraggingRef.current = true
    prevMousePosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e) => {
    isDraggingRef.current = false
  }

  // Click Interaction: Raycast & GSAP Fly-to camera zoom
  const handleClick = (e) => {
    if (!cameraRef.current || !nodesGroupRef.current) return
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
    const intersects = raycasterRef.current.intersectObjects(nodesGroupRef.current.children, true)

    if (intersects.length > 0) {
      let hitMesh = intersects[0].object
      while (hitMesh.parent && hitMesh.parent !== nodesGroupRef.current) {
        hitMesh = hitMesh.parent
      }

      const receipt = hitMesh.userData?.receipt
      if (receipt) {
        // Camera smooth fly-to node coordinates via GSAP
        const targetPos = hitMesh.position.clone()
        gsap.to(cameraRef.current.position, {
          x: targetPos.x * 0.6,
          y: targetPos.y * 0.6,
          z: targetPos.z + 140,
          duration: 1.2,
          ease: 'power3.inOut'
        })

        // Trigger selection callback
        if (onSelectReceipt) {
          onSelectReceipt(receipt)
        }
      }
    }
  }

  // Camera Controls
  const handleResetCamera = () => {
    if (!cameraRef.current || !nodesGroupRef.current || !linesGroupRef.current) return
    gsap.to(cameraRef.current.position, {
      x: 0,
      y: 0,
      z: 320,
      duration: 1.2,
      ease: 'power2.out'
    })
    gsap.to(nodesGroupRef.current.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power2.out' })
    gsap.to(linesGroupRef.current.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'power2.out' })
  }

  const handleZoom = (direction) => {
    if (!cameraRef.current) return
    const targetZ = Math.max(120, Math.min(500, cameraRef.current.position.z + (direction === 'in' ? -60 : 60)))
    gsap.to(cameraRef.current.position, { z: targetZ, duration: 0.6, ease: 'power2.out' })
  }

  return (
    <div className="relative w-full rounded-2xl border border-[#23252a] bg-[#090a0d] p-4 sm:p-6 overflow-hidden shadow-2xl">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial-at-c from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Top Header Bar & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Three.js 3D Engine
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {activeReceipts.length} Constellation Nodes
            </span>
          </div>
          <h3 className="text-lg font-sans font-bold text-white mt-1">
            Interactive Celestial Archive
          </h3>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all duration-200 border ${
                selectedFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-[#15171c] text-zinc-400 border-[#272930] hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl overflow-hidden border border-[#1e2025] bg-[#060709]">
        
        {/* Loading State: 3D Wireframe Loader */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#090a0d]/90 backdrop-blur-md space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Initializing Celestial Constellation...
            </div>
            <div className="text-[11px] text-zinc-500">
              Generating WebGL particle system and 3D node coordinates
            </div>
          </div>
        )}

        {/* Error State: WebGL Fallback */}
        {webglError && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#090a0d] p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="max-w-sm">
              <h4 className="text-sm font-bold text-white font-sans">WebGL Canvas Error</h4>
              <p className="text-xs text-rose-300/80 mt-1">{webglError}</p>
            </div>
            <button
              onClick={initThree}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry WebGL Engine</span>
            </button>
          </div>
        )}

        {/* Empty State: Zero Nodes for selected category */}
        {!isLoading && !webglError && activeReceipts.length === 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#090a0d]/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#15171c] border border-zinc-800 text-zinc-400 flex items-center justify-center text-xl">
              🌌
            </div>
            <h4 className="text-sm font-bold text-white">No Celestial Nodes in Sector</h4>
            <p className="text-xs text-zinc-400 max-w-xs">
              There are no receipts in the "{selectedFilter}" category. Clear filter to view all constellation nodes.
            </p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all"
            >
              Reset Sector Filter
            </button>
          </div>
        )}

        {/* The Three.js WebGL Mount */}
        <div
          ref={mountRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        />

        {/* Floating 3D Tooltip on Hover */}
        {hoveredData && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-xl bg-[#111216]/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-left min-w-[180px] max-w-xs transition-all duration-75"
            style={{
              left: `${Math.max(100, Math.min(tooltipPos.x, (mountRef.current?.clientWidth || 600) - 100))}px`,
              top: `${Math.max(60, tooltipPos.y)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-1 mb-1 border-b border-zinc-800 text-[10px] font-mono">
              <span className="text-emerald-400 uppercase font-bold">{hoveredData.type}</span>
              <span className="text-zinc-400">{hoveredData.time}</span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              {hoveredData.title}
            </div>
            <div className="text-[11px] text-zinc-400 truncate mt-0.5">
              {hoveredData.category} • {hoveredData.date}
            </div>
            <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
              <span>Click to inspect node</span>
              <span>→</span>
            </div>
          </div>
        )}

        {/* Camera HUD Controls (Zoom In, Zoom Out, Reset Center) */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-[#15171c]/90 border border-[#272930] p-1.5 rounded-xl backdrop-blur-md shadow-lg">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#23252a] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#23252a] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-[#23252a] transition-colors"
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Orbit Guidance Badge */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-[#111216]/80 px-2.5 py-1 rounded-lg border border-zinc-800">
          <span>Drag to rotate 3D orbit</span>
          <span>•</span>
          <span>Click node to fly & inspect</span>
        </div>
      </div>

      {/* Active Selection Strip */}
      <div className="mt-4 p-3 sm:p-4 rounded-xl bg-[#111216] border border-[#23252a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
              {hoveredData ? `Inspecting: ${hoveredData.title}` : 'Ready for Navigation'}
            </div>
            <div className="text-xs text-zinc-400">
              {hoveredData 
                ? `${hoveredData.description || 'Occurred on ' + hoveredData.date}` 
                : 'Hover or click on any celestial sphere to focus camera and reveal deep contextual bonds.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hoveredData && onSelectReceipt && (
            <button
              onClick={() => onSelectReceipt(hoveredData)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              Inspect Receipt →
            </button>
          )}

          {onOpenGraph && (
            <button
              onClick={onOpenGraph}
              className="px-3 py-1.5 rounded-lg bg-[#1a1c22] hover:bg-[#23252a] border border-[#272930] text-zinc-300 hover:text-white text-xs font-medium transition-colors"
            >
              Open Full 2D Graph
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
