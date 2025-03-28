"use client"

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
      title: "Monalisa",
      artist: "Leonardo da Vinci",
      description:
        "The Mona Lisa is a half-length portrait of a woman with an enigmatic expression, painted by Leonardo da Vinci in the early 16th century. The subject sits against a soft, hazy landscape, with winding paths and a distant horizon that add depth to the composition.",
      position: [-4, 1, -3],
      rotation: [0, Math.PI / 8, 0],
      texture: "/preview/img1.jpg",
    },
    {
      id: 2,
      title: "The Standard of Ur",
      artist: "Sumerian artifact",
      description:
        "A 4,500-year-old Sumerian artifact featuring detailed war and peace scenes, giving insight into early Mesopotamian civilization.",
      position: [-1.5, 1, -4],
      rotation: [0, 0, 0],
      texture: "/preview/img2.jpg",
    },
    {
      id: 3,
      title: "Mask of Tutankhamun",
      artist: "Ancient Egyptian craftsmen",
      description:
        "The Mask of Tutankhamun is a golden funerary mask that covered the face of Pharaoh Tutankhamun inside his sarcophagus.",
      position: [1.5, 1, -4],
      rotation: [0, 0, 0],
      texture: "/preview/img3.jpg",
    },
    {
      id: 4,
      title: "The Sword of Goujian",
      artist: "ancient Chinese blacksmiths",
      description:
        "The Sword of Goujian is a bronze double-edged sword that remains remarkably sharp and untarnished, even after more than 2,500 years.",
      position: [4, 1, -3],
      rotation: [0, -Math.PI / 8, 0],
      texture: "/preview/img4.jpg",
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

    //animateCamera()
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
        <meshStandardMaterial color={isDark ? "#D4AF37" : "#D4AF37"} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1, -5]} receiveShadow>
        <boxGeometry args={[20, 5, 0.2]} />
        <meshStandardMaterial color={isDark ? "#002147" : "#002147"} metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[-5, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color={isDark ? "#FAF3E0" : "#FAF3E0"} metalness={0.1} roughness={0.9} />
      </mesh>

      <mesh position={[5, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 5, 0.2]} />
        <meshStandardMaterial color={isDark ? "#FAF3E0" : "#FAF3E0"} metalness={0.1} roughness={0.9} />
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

export default function ExhibitPreview() {
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

