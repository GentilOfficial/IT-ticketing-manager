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
import { FieldGroup } from '@/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useTicketForm, { TICKET_DESCRIPTION_LENGTH, TICKET_TITLE_LENGTH } from '@/hooks/useTicketForm'
import { AlertCircle, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const EditTicketDetails = ({ ticketToEdit, onTicketUpdated }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { ticket, isLoading, errors, onChangeSetTicketField, submitEditTicketForm, resetMessages } = useTicketForm({
    initialTicket: {
      _id: ticketToEdit._id,
      title: ticketToEdit.title,
      description: ticketToEdit.description,
    },
    onSuccess: (updatedTicket, message) => {
      if (onTicketUpdated) onTicketUpdated(updatedTicket)
      toast.success(message, { position: 'top-center' })
      setIsOpen(false)
    },
  })

  const canSubmitForm = Object.values(ticket).every(Boolean)

  const fieldErrors = Array.isArray(errors) ? errors : []
  const formError = typeof errors === 'string' ? errors : null

  const handleOpenChange = (handledState) => {
    if (handledState) resetMessages()
    setIsOpen(handledState)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
              <SquarePen />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit ticket</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:min-w-lg">
        <DialogHeader>
          <DialogTitle>Edit ticket</DialogTitle>
          <DialogDescription>Make changes to the ticket here.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submitEditTicketForm}>
          <FieldGroup>
            <FormField
              name="title"
              label="Title"
              placeholder="Ex. My PC won't turn on after updates"
              required
              value={ticket.title}
              onChange={onChangeSetTicketField}
              errors={fieldErrors}
              disabled={isLoading}
              minLength={TICKET_TITLE_LENGTH.min}
              maxLength={TICKET_TITLE_LENGTH.max}
            />
            <FormField
              name="description"
              label="Description"
              placeholder="Describe the issue details: when it occurred, what you've already tried, any error messages that appeared..."
              required
              multiline
              value={ticket.description}
              onChange={onChangeSetTicketField}
              errors={fieldErrors}
              disabled={isLoading}
              minLength={TICKET_DESCRIPTION_LENGTH.min}
              maxLength={TICKET_DESCRIPTION_LENGTH.max}
              className="min-h-44"
            />
            {formError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Unable to edit ticket</AlertTitle>
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

export default EditTicketDetails
