import EmptyUsers from '@/components/empty/EmptyUsers'
import InitUsersLoading from '@/components/loading/InitUsersLoading'
import UserAvatar from '@/components/shared/UserAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Command, CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Spinner } from '@/components/ui/spinner'
import useUsers from '@/hooks/useUsers'
import { AlertTriangle, ChevronsUpDown, ShieldUser, User, UserRound, X } from 'lucide-react'
import { useState } from 'react'

const CreateTicketUserPicker = ({ selectedUser, onSelectUser, disabled, errors }) => {
  const [open, setOpen] = useState(false)
  const { query, setQuery, users, pagination, isLoading, error, loadMoreUsers } = useUsers({ enabled: open })

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen)
    if (!nextOpen) setQuery('')
  }

  const handleSelectUser = (user) => {
    onSelectUser(user)
    handleOpenChange(false)
  }

  const handleClearSelection = () => {
    onSelectUser(null)
  }

  return (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-w-0 flex-1 justify-between gap-2 py-1.5 font-normal"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {selectedUser ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="shrink-0">
                <UserAvatar user={selectedUser} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <span className="w-full truncate text-xs font-medium">{selectedUser.name}</span>
                <span className="w-full truncate text-xs text-muted-foreground">{selectedUser.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <User className="size-3.5 shrink-0" />
              <span className="truncate">You (default)</span>
            </div>
          )}
          <ChevronsUpDown className="ml-auto size-3.5 shrink-0 opacity-50" />
        </Button>
        {selectedUser && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleClearSelection}
            disabled={disabled}
          >
            <X className="size-3.5" />
          </Button>
        )}
        <CommandDialog open={open} onOpenChange={handleOpenChange}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Select behalf of... search by name or email"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandGroup>
                {error ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="size-4" />
                    <AlertTitle>Unable to load users</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : isLoading && users.length === 0 ? (
                  <InitUsersLoading />
                ) : users.length === 0 ? (
                  <EmptyUsers />
                ) : (
                  <>
                    {users.map((user) => (
                      <CommandItem
                        key={user._id}
                        value={user._id}
                        onSelect={() => handleSelectUser(user)}
                        className="gap-2"
                      >
                        {user.role === 'admin' ? (
                          <ShieldUser className="size-3.5 shrink-0 text-primary" />
                        ) : (
                          <UserRound className="size-3.5 shrink-0" />
                        )}
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate">{user.name}</span>
                          <span className="truncate text-muted-foreground">{user.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                    {pagination && pagination.hasNext && (
                      <div className="p-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={loadMoreUsers}
                          disabled={isLoading}
                        >
                          {isLoading ? <Spinner /> : null}
                          <span>Load more</span>
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
      {errors && (
        <ul className="list-disc list-inside text-xs">
          {errors.map((err, i) => (
            <li key={`error-createdBy-${i}`} className="text-destructive">
              {err.message}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default CreateTicketUserPicker
