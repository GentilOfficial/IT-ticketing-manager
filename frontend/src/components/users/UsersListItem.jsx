import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import AuthProviderBadge from '@/components/users/AuthProviderBadge'
import EditUserDialog from '@/components/users/EditUserDialog'
import UserRoleBadge from '@/components/users/UserRoleBadge'
import { useAuth } from '@/context/AuthContext'
import { Pencil, UserStar } from 'lucide-react'
import moment from 'moment'

const UsersListItem = ({ user, isLast = false, onUserUpdated }) => {
  const { user: authUser } = useAuth()
  const createdAt = moment(user.createdAt).format('MMM YYYY')
  return (
    <>
      <div className="group relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50">
        <div className="flex items-start sm:items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium leading-tight truncate">{user.name}</span>
                {user._id === authUser._id && (
                  <>
                    <Separator orientation="vertical" />
                    <Badge variant="outline">
                      <UserStar />
                      <span>you</span>
                    </Badge>
                  </>
                )}
              </div>
              <span className="text-sm text-muted-foreground truncate">{user.email}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <UserRoleBadge role={user.role} className="text-xs py-0.5 px-2" />
              <Separator orientation="vertical" />
              <AuthProviderBadge provider={user.oauth?.provider} className="text-xs" />
              <Separator orientation="vertical" className="sm:hidden" />
              <span className="text-xs text-muted-foreground sm:hidden">Joined {createdAt}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline text-xs text-muted-foreground whitespace-nowrap">Joined {createdAt}</span>
          <EditUserDialog
            user={user}
            onUserUpdated={onUserUpdated}
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 sm:static text-muted-foreground"
              >
                <Pencil />
              </Button>
            }
          />
        </div>
      </div>
      {!isLast && <Separator />}
    </>
  )
}

export default UsersListItem
