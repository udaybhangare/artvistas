"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"


import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Html, useTexture, Text } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

// Artwork with interactive elements
function Artwork({ position, rotation, texture, title, artist, description, onClick }) {
  const [hovered, setHovered] = useState(false)
  const frameRef = useRef()
  const artTexture = useTexture(texture)

  useFrame(({ clock }) => {
    if (frameRef.current && hovered) {
      frameRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05 + rotation[1]
    }
  })

  return (
    <group
      ref={frameRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color={hovered ? "#7c3aed" : "#222"} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Artwork */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.8, 2.8]} />
        <meshStandardMaterial map={artTexture} />
      </mesh>

      {/* Hover indicator */}
      {hovered && (
        <Html position={[0, -1.8, 0.2]} center>
          <div className="px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">Click to view</div>
        </Html>
      )}

      {/* Title */}
      <Text position={[0, -1.6, 0.06]} fontSize={0.15} color="#ffffff" anchorX="center" anchorY="middle" maxWidth={1.8}>
        {title}
      </Text>
    </group>
  )
}

// Museum Room
function MuseumRoom() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const { camera } = useThree()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === "dark"

  const artworks = [
    {
      id: 1,
      title: "Willamette Meteorite",
      artist: "Nature",
      description:
        "The Willamette Meteorite is the largest meteorite ever found in the United States and the sixth-largest in the world. It weighs over 15.5 tons (31,000 lbs) and measures about 10 feet (3 meters) wide.",
      position: [-4, 1, -3],
      rotation: [0, Math.PI / 8, 0],
      texture: "/natural/img1.jpg",
    },
    {
      id: 2,
      title: "Coelacanth",
      artist: "Nature",
      description:
        "The coelacanth is a deep-sea fish often called a living fossil because it was once thought to have gone extinct 65 million years ago, until its surprise rediscovery in 1938. These fish belong to an ancient lineage of lobe-finned fishes, which are closely related to the ancestors of amphibians, reptiles, and mammals.",
      position: [-1.5, 1, -4],
      rotation: [0, 0, 0],
      texture: "/natural/img2.jpg",
    },
    {
      id: 3,
      title: "Opal stone",
      artist: "Nature",
      description:
        "Opal is a precious gemstone known for its iridescent play-of-color, where it reflects rainbow-like hues due to its unique microscopic silica structure. Unlike crystalline gemstones, opal is an amorphous mineraloid.",
      position: [1.5, 1, -4],
      rotation: [0, 0, 0],
      texture: "/natural/img3.jpg",
    },
    {
      id: 4,
      title: "Tyrannosaurus",
      artist: "Nature",
      description:
        "The Tyrannosaurus rex is one of the most famous and fearsome carnivorous dinosaurs. It was a bipedal predator with massive jaws, powerful legs, and tiny arms. T. rex was one of the largest meat-eating dinosaurs, with a bite force of over 12,000 pounds per square inch, making it the most powerful bite of any land animal.",
      position: [4, 1, -3],
      rotation: [0, -Math.PI / 8, 0],
      texture: "/natural/img4.jpg",
    },
  ]

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork)

    // Move camera to focus on the artwork
    const direction = new THREE.Vector3()
      .subVectors(new THREE.Vector3(...artwork.position), camera.position)
      .normalize()

    const targetPosition = new THREE.Vector3().addVectors(
      new THREE.Vector3(...artwork.position),
      direction.multiplyScalar(-3),
    )

    // Animate camera movement
    const startPosition = camera.position.clone()
    const startTime = Date.now()
    const duration = 1000 // ms

    const animateCamera = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease out

      camera.position.lerpVectors(startPosition, targetPosition, easeProgress)
      camera.lookAt(...artwork.position)

      if (progress < 1) {
        requestAnimationFrame(animateCamera)
      }
    }

    animateCamera()
  }

  const closeArtworkDetails = () => {
    setSelectedArtwork(null)
  }

  return (
    <>
      {/* Environment */}
      <Environment preset={isDark ? "night" : "city"} />
      <fog attach="fog" args={[isDark ? "#0f1729" : "#e2e8f0", 1, 15]} />
      <ambientLight intensity={isDark ? 0.5 : 1} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1 : 2} castShadow shadow-mapSize={1024} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={isDark ? "#5D4037" : "#5D4037"} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1, -5]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color={isDark ? "#C4A484" : "#C4A484"} metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color={isDark ? "#4B6F44" : "#4B6F44"} metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[5, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color={isDark ? "#4B6F44" : "#4B6F44"} metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Artworks */}
      {artworks.map((artwork) => (
        <Artwork
          key={artwork.id}
          title={artwork.title}
          artist={artwork.artist}
          description={artwork.description}
          position={artwork.position}
          rotation={artwork.rotation}
          texture={artwork.texture}
          onClick={() => handleArtworkClick(artwork)}
        />
      ))}

      {/* Artwork Details Modal */}
      {selectedArtwork && (
        <Html center position={[0, 0, -2]}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 w-80 rounded-lg shadow-lg backdrop-blur-md bg-background/90"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedArtwork.title}</h3>
                <p className="text-primary">{selectedArtwork.artist}</p>
              </div>
              <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full" onClick={closeArtworkDetails}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4">
              <img
                src={selectedArtwork.texture || "/placeholder.svg"}
                alt={selectedArtwork.title}
                className="object-cover mb-4 w-full h-48 rounded-md"
              />
              <p className="text-sm text-muted-foreground">{selectedArtwork.description}</p>
            </div>

            <div className="flex justify-between">
              <Button size="sm" variant="outline" className="rounded-full">
                Add to Collection
              </Button>
              <Button size="sm" className="rounded-full">
                Learn More
              </Button>
            </div>
          </motion.div>
        </Html>
      )}
    </>
  )
}

function ExhibitPreview() {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={60} />
        <MuseumRoom />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}



export default function ExhibitPage() {
  return (
    <main className="overflow-hidden w-full h-screen bg-background">
      <Suspense fallback={<LoadingFallback />}>
        <ExhibitPreview />
      </Suspense>
    </main>
  )
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col gap-4 items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading 3D Gallery...</p>
      </div>
    </div>
  )
}
