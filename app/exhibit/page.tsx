"use client"

import { Suspense } from "react"
import ExhibitPreview from "@/components/exhibit-preview"
import { Loader2 } from "lucide-react"

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

