import EmptyUsers from '@/components/empty/EmptyUsers'
import InitUsersLoading from '@/components/loading/InitUsersLoading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import useUsers from '@/hooks/useUsers'
import { AlertTriangle } from 'lucide-react'
import UsersListItem from './UsersListItem'

const UsersList = () => {
  const { query, setQuery, users, handleUserUpdated, isLoading, error, pagination, loadMoreUsers } = useUsers()

  return (
    <div className="flex flex-col gap-3 w-full">
      <Input
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:max-w-sm"
      />
      {error ? (
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="size-4" />
          <AlertTitle>Unable to load users</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="rounded-md border bg-background w-full">
            {isLoading && users.length === 0 ? (
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
          {pagination && pagination.hasNext && (
            <Button variant="outline" className="self-center" onClick={loadMoreUsers} disabled={isLoading}>
              {isLoading ? <Spinner /> : null}
              <span>Load more</span>
            </Button>
          )}
        </>
      )}
    </div>
  )
}

export default UsersList
