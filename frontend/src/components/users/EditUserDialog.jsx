import FormField from '@/components/form/FormField'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useUserForm from '@/hooks/useUserForm'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const EditUserDialog = ({ user, trigger = null, onUserUpdated }) => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    user: userForm,
    isLoading,
    errors,
    onChangeSetUserField,
    updateUserField,
    submitEditUserForm,
    resetMessages,
  } = useUserForm({
    initialUser: {
      _id: user._id,
      name: user.name,
      role: user.role,
    },
    onSuccess: (updatedUser, message) => {
      if (onUserUpdated) onUserUpdated(updatedUser)
      toast.success(message, { position: 'top-center' })
      setIsOpen(false)
    },
  })

  const canSubmitForm = Object.values(userForm).every(Boolean)

  const fieldErrors = Array.isArray(errors) ? errors : []
  const formError = typeof errors === 'string' ? errors : null
  const hasRoleError = fieldErrors.some((err) => err.field === 'role')

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) resetMessages()
    setIsOpen(nextOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update the user name and role.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submitEditUserForm}>
          <FieldGroup>
            <FormField
              name="name"
              label="Name"
              placeholder="Enter the user name"
              required
              value={userForm.name}
              onChange={onChangeSetUserField}
              errors={fieldErrors}
              disabled={isLoading}
            />
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select
                value={userForm.role}
                onValueChange={(value) => updateUserField('role', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {hasRoleError && (
                <ul className="list-disc list-inside text-xs">
                  {fieldErrors
                    .filter((err) => err.field === 'role')
                    .map((err, index) => (
                      <li key={`role-error-${index}`} className="text-destructive">
                        {err.message}
                      </li>
                    ))}
                </ul>
              )}
            </Field>
            {formError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Unable to edit user</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!canSubmitForm || isLoading}>
                Save changes
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
