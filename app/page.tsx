"use client"

import { Suspense } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import HeroSection from "@/components/hero-section"
import FeaturedExhibits from "@/components/featured-exhibits"
import ExhibitPreview from "@/components/exhibit-preview"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, Sparkles, Users, Calendar } from "lucide-react"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section with 3D Background */}
      <section className="overflow-hidden relative w-full h-screen">
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-screen bg-black/20">Loading 3D Experience...</div>
          }
        >
          <HeroSection />
        </Suspense>

        {/* Navigation */}
        <Navbar />

        {/* Hero Content */}
        <div className="flex absolute inset-0 z-10 justify-center items-center px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold text-black drop-shadow-lg dark:text-white md:text-6xl">
              Experience Art in a New Dimension
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg drop-shadow-md text-black/80 dark:text-white/90 md:text-xl">
              Explore our immersive virtual gallery featuring curated exhibits and interactive experiences
            </p>
            <div className="flex flex-col gap-4 justify-center sm:flex-row">
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90"
                onClick={() => router.push("/exhibit")}
              >
                Start Virtual Tour
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-black rounded-full backdrop-blur-sm dark:text-white bg-background/20 border-black/20 dark:border-white/20 hover:bg-black/10 dark:hover:bg-white/30"
                onClick={() => router.push("/preview")}
              >
                Explore Exhibits
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 animate-bounce transform -translate-x-1/2">
          <div className="flex justify-center items-start p-1 w-8 h-12 rounded-full border-2 border-white/50">
            <div className="w-1 h-3 rounded-full animate-pulse bg-white/80"></div>
          </div>
        </div>
      </section>

      {/* Featured Exhibits Section */}
      <section id="exhibits" className="px-4 py-20 md:px-6 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Featured Exhibits</h2>
              <p className="text-muted-foreground">Discover our curated collection of masterpieces</p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => router.push("/preview")}>
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="h-[500px] w-full">
            <Suspense
              fallback={
                <div className="flex justify-center items-center w-full h-full bg-muted">Loading exhibits...</div>
              }
            >
              <FeaturedExhibits />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Virtual Tour Preview */}
      <section id="virtual-tour" className="px-4 py-20 md:px-6 bg-muted/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Virtual Walkthrough</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Navigate through our museum as if you were there in person. Click on artworks to learn more.
            </p>
          </div>

          <div className="h-[600px] w-full rounded-xl overflow-hidden">
            <Suspense
              fallback={
                <div className="flex justify-center items-center w-full h-full bg-muted">Loading virtual tour...</div>
              }
            >
              <ExhibitPreview />
            </Suspense>
          </div>

          <div className="mt-8 text-center">
            <Button size="lg" className="rounded-full" onClick={() => router.push("/exhibit")}>
              Enter Full Experience
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 md:px-6 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold">Explore Our Features</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              ArtVistas offers a range of innovative ways to experience and interact with art
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* AR Mode */}
            <div className="p-6 rounded-xl border transition-all bg-card border-border hover:shadow-lg group">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AR Experience</h3>
              <p className="mb-4 text-muted-foreground">
                Place virtual artworks in your own space using our WebAR technology
              </p>
              <Button variant="ghost" className="p-0 transition-colors group-hover:text-primary">
                Try AR Mode <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* AI Art Guide */}
            <div className="p-6 rounded-xl border transition-all bg-card border-border hover:shadow-lg group">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI Art Guide</h3>
              <p className="mb-4 text-muted-foreground">
                Get personalized insights and information about artworks from our AI assistant
              </p>
              <Button variant="ghost" className="p-0 transition-colors group-hover:text-primary">
                Chat with Guide <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* NFT Showcase */}
            <div className="p-6 rounded-xl border transition-all bg-card border-border hover:shadow-lg group">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">NFT Gallery</h3>
              <p className="mb-4 text-muted-foreground">
                Explore digital art and NFT collections in our dedicated virtual space
              </p>
              <Button variant="ghost" className="p-0 transition-colors group-hover:text-primary">
                View Collection <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Live Events */}
            <div className="p-6 rounded-xl border transition-all bg-card border-border hover:shadow-lg group">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Live Events</h3>
              <p className="mb-4 text-muted-foreground">
                Attend virtual workshops, artist talks, and interactive exhibitions
              </p>
              <Button variant="ghost" className="p-0 transition-colors group-hover:text-primary">
                View Schedule <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Personal Collection */}
            <div className="p-6 rounded-xl border transition-all bg-card border-border hover:shadow-lg group">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personal Gallery</h3>
              <p className="mb-4 text-muted-foreground">
                Create your own collection by saving favorite artworks during your visit
              </p>
              <Button variant="ghost" className="p-0 transition-colors group-hover:text-primary">
                Start Collection <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* Interactive Quiz */}
            <div className="p-6 rounded-xl border transition-all bg-card border-border hover:shadow-lg group">
              <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full transition-colors bg-primary/10 group-hover:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Art Quiz</h3>
              <p className="mb-4 text-muted-foreground">
                Test your knowledge and discover new artworks that match your taste
              </p>
              <Button variant="ghost" className="p-0 transition-colors group-hover:text-primary">
                Take Quiz <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-muted md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 justify-between md:flex-row">
            <div className="mb-8 md:mb-0">
              <div className="flex gap-2 items-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">ArtVistas</span>
              </div>
              <p className="max-w-xs text-muted-foreground">
                Redefining how we experience art through immersive digital technology
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h4 className="mb-4 font-semibold">Explore</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Exhibits
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Virtual Tour
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      NFT Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Events
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Features</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      AR Experience
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      AI Art Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Personal Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Art Quiz
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Newsletter
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="transition-colors text-muted-foreground hover:text-foreground">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-center pt-8 mt-12 border-t border-border md:flex-row">
            <p className="text-sm text-muted-foreground">© 2025 ArtVistas. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">© Developed by Uday and Yuvraj</p>
            <div className="flex mt-4 space-x-4 md:mt-0">
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

