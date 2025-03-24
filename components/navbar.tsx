"use client"

import Link from "next/link"
import { Menu, Palette, X } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useState, useEffect } from "react"

export default function Navbar() {
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Close menu when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <nav className="mx-auto max-w-7xl backdrop-blur-md bg-background/70 rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ArtVistas</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#exhibits" className="text-sm font-medium hover:text-primary transition-colors">
            Exhibits
          </Link>
          <Link href="#virtual-tour" className="text-sm font-medium hover:text-primary transition-colors">
            Virtual Tour
          </Link>
          <Link href="#events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link href="#nft-showcase" className="text-sm font-medium hover:text-primary transition-colors">
            NFT Showcase
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button size="sm" className="rounded-full hidden md:flex">
            Sign In
          </Button>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] z-50 px-4 py-2">
          <div className="bg-background/95 backdrop-blur-md rounded-lg shadow-lg p-4 flex flex-col space-y-3 border border-border">
            <Link 
              href="#exhibits" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Exhibits
            </Link>
            <Link 
              href="#virtual-tour" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Virtual Tour
            </Link>
            <Link 
              href="#events" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="#nft-showcase" 
              className="text-sm font-medium hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              NFT Showcase
            </Link>
            <Button size="sm" className="w-full mt-2">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}