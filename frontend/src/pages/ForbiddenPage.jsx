import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, ShieldX } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

const ForbiddenPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Helpdesk - Forbidden'
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background py-12 px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <ShieldX className="size-6 text-muted-foreground" />
        </div>
        <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
          403 • Forbidden
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Access denied</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          You don't have permission to access this resource. If you believe this is an error, please contact the system
          administrator.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 size-4" />
            Go back
          </Button>
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 size-4" />
              <span>Homepage</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default ForbiddenPage
