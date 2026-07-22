import ThemeSwitcher from '@/components/theme/ThemeSwitcher'
import { Button } from '@/components/ui/button'
import { Headset, Scroll } from 'lucide-react'
import { Link } from 'react-router'

const AuthLayout = ({ children }) => {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-between">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center gap-2">
              <Headset className="size-5 text-primary" />
              <span className="font-semibold text-sm">HelpDesk</span>
            </div>
          </Link>
          <ThemeSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center">{children}</div>
        <div className="flex justify-center gap-2 md:justify-end">
          <Button asChild variant="outline" className="text-muted-foreground rounded-full">
            <a href={`${import.meta.env.VITE_API_SERVER}/docs`} target="_blank">
              <Scroll className="size-6 p-1" />
              <span>API Documentation</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
