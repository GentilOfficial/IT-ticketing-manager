import EmptyUsers from '@/components/empty/EmptyUsers'
import InitUsersLoading from '@/components/loading/InitUsersLoading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useUsers from '@/hooks/useUsers'
import { AlertTriangle } from 'lucide-react'
import UsersListItem from './UsersListItem'

const UsersList = () => {
  const { users, handleUserUpdated, isLoading, error } = useUsers()

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="size-4" />
        <AlertTitle>Unable to load users</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="rounded-md border bg-background w-full">
      {isLoading ? (
        <div className="py-12">
          <InitUsersLoading />
        </div>
      ) : users.length > 0 ? (
        users.map((user, i) => (
          <UsersListItem
            key={`${user._id}-${i}`}
            user={user}
            isLast={i + 1 === users.length}
            onUserUpdated={handleUserUpdated}
          />
        ))
      ) : (
        <EmptyUsers />
      )}
    </div>
  )
}

export default UsersList
