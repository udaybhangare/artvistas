"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, PerspectiveCamera, Html, Float } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"
import * as THREE from "three"
import { useTheme } from "next-themes"

const exhibits = [
  {
    id: 1,
    title: "Modern Abstractions",
    artist: "Elena Rodriguez",
    description: "A collection of contemporary abstract works exploring color and form",
    image: "/featured/img1.jpg",
  },
  {
    id: 2,
    title: "Digital Landscapes",
    artist: "Marcus Chen",
    description: "AI-generated landscapes that blend reality with digital imagination",
    image: "/featured/img2.jpg",
  },
  {
    id: 3,
    title: "Renaissance Reimagined",
    artist: "Sofia Patel",
    description: "Classic Renaissance techniques applied to contemporary subjects",
    image: "/featured/img3.jpg",
  },
  {
    id: 4,
    title: "Futuristic Sculptures",
    artist: "Jamal Washington",
    description: "3D printed sculptures exploring the intersection of technology and art",
    image: "/featured/img4.jpg",
  },
  {
    id: 5,
    title: "Urban Expressions",
    artist: "Leo Kim",
    description: "Street art inspired works capturing the energy of city life",
    image: "/featured/img5.jpg",
  },
]

function ExhibitCard({ exhibit, isActive, onClick, position }) {
  const { theme } = useTheme()
  const [borderColor, setBorderColor] = useState("#8B4513")
  useEffect(() => {
    setBorderColor(theme === "dark" ? "#8B4513" : "#222") // Brown in dark mode, gray in light mode
  }, [theme])
  return (
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group onClick={onClick} scale={isActive ? 1.2 : 0.8} position={position}>
          {/* Frame */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[2.6, 2.6, 0.1]} />
            <meshStandardMaterial color={borderColor} metalness={0.5} roughness={0.2} />
          </mesh>
  
          {/* Image */}
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[2.4, 2.4]} />
            <meshBasicMaterial map={new THREE.TextureLoader().load(exhibit.image)} />
          </mesh>
        </group>
      </Float>
  )
}

function ExhibitsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const groupRef = useRef()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05
    }
  })

  const nextExhibit = () => {
    setActiveIndex((prev) => (prev + 1) % exhibits.length)
  }

  const prevExhibit = () => {
    setActiveIndex((prev) => (prev - 1 + exhibits.length) % exhibits.length)
  }

  return (
    <>
      <group ref={groupRef}>
        {exhibits.map((exhibit, index) => {
          const angle = ((index - activeIndex) / exhibits.length) * Math.PI * 2
          const x = Math.sin(angle) * 5
          const z = Math.cos(angle) * 5

          return (
            <ExhibitCard
              key={exhibit.id}
              exhibit={exhibit}
              isActive={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              position={[x, 0, z]}
            />
          )
        })}
      </group>

      <Html position={[0, -3.2, 0]} center>
        <div className="flex gap-6">
          <Button size="lg" variant="secondary" className="w-14 h-14 rounded-full shadow-lg" onClick={prevExhibit}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button size="lg" variant="secondary" className="w-14 h-14 rounded-full shadow-lg" onClick={nextExhibit}>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </Html>
    </>
  )
}

export default function FeaturedExhibits() {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <ExhibitsCarousel />
      </Canvas>
    </div>
  )
}

