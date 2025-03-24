import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Exhibit Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        The museum exhibit you're looking for seems to be missing from our collection.
      </p>
      <Button asChild>
        <Link href="/preview">
          <Home className="mr-2 h-4 w-4" />
          Return to Gallery
        </Link>
      </Button>
    </div>
  )
}

