"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Float, Text3D, useTexture } from "@react-three/drei"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

// Museum Environment
function MuseumEnvironment() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === "dark"

  return (
    <>
      <Environment preset={isDark ? "night" : "city"} />
      <fog attach="fog" args={[isDark ? "#0f1729" : "#e2e8f0", 5, 30]} />
      <ambientLight intensity={isDark ? 0.5 : 1} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1 : 2} castShadow shadow-mapSize={1024} />
    </>
  )
}

// Floating Logo
function FloatingLogo() {
  const textRef = useRef()

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2 + 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Text3D
        ref={textRef}
        font="/fonts/Geist_Bold.json"
        size={0.7}
        height={0.2}
        curveSegments={12}
        position={[-3,-3 , -3]} // Moved much higher
      >
        ArtVistas
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Text3D>
    </Float>
  )
}


// Artwork Frame
function ArtworkFrame({ position, rotation, texture, scale = [3, 6, 0.1] }) {
  const frameRef = useRef()
  const artTexture = useTexture(texture)

  useFrame(({ clock }) => {
    if (frameRef.current) {
      frameRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05 + rotation[1]
    }
  })

  return (
    <group ref={frameRef} position={position} rotation={rotation} scale={scale}>
      {/* Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.05]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Artwork */}
      <mesh position={[0, 0, 0.06]} scale={[0.95, 0.95, 1]}>
        <planeGeometry args={[1.4, 1.4]} /> {/* Adjusted to fit the new width */}
        <meshStandardMaterial map={artTexture} />
      </mesh>
    </group>
  )
}


// Floor
function Floor() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === "dark"

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={isDark ? "#1e293b" : "#f8fafc"} metalness={0.2} roughness={0.8} />
    </mesh>
  )
}

// Main Scene
function Scene() {
  const { camera } = useThree()
  const isMobile = useMobile()

  useEffect(() => {
    camera.position.set(0, 2, 14) // Adjusted to fit wider frames

    if (isMobile) {
      camera.position.z = 18
    }
  }, [camera, isMobile])

  return (
    <>
      <MuseumEnvironment />
      {/* <FloatingLogo /> */}

      {/* Adjusted frame positions to avoid overlap */}
      <ArtworkFrame position={[-6, 1.5, -5]} rotation={[0, Math.PI / 8, 0]} texture="/hero/img1.jpg" />
      <ArtworkFrame position={[0, 1.5, -7]} rotation={[0, 0, 0]} texture="/hero/img2.jpg" />
      <ArtworkFrame position={[6, 1.5, -5]} rotation={[0, -Math.PI / 8, 0]} texture="/hero/img3.jpg" />

      <Floor />
    </>
  )
}





export default function HeroSection() {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={60} />
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}

