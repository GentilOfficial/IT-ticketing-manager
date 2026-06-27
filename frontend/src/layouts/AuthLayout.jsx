import { Headset } from 'lucide-react'
import { Link } from 'react-router'

const AuthLayout = ({ children }) => {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center gap-2">
              <Headset className="size-5 text-primary" />
              <span className="font-semibold text-sm">HelpDesk</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
