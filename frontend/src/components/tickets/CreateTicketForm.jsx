import FormField from '@/components/form/FormField'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import useTicketForm from '@/hooks/useTicketForm'
import { useAuth } from '@/providers/AuthProvider'
import { AlertCircle, ArrowLeft, Eraser, Send, TicketCheck } from 'lucide-react'
import { Link } from 'react-router'

const TITLE_LENGTH = { min: 5, max: 120 }
const DESCRIPTION_LENGTH = { min: 10, max: 4000 }

const CreateTicketForm = () => {
  const { token } = useAuth()
  const { ticket, isLoading, errors, success, onChangeSetTicketField, resetFormFields, submitTicketForm } =
    useTicketForm(token)

  const canSubmitForm = Object.values(ticket).every(Boolean)

  const fieldErrors = Array.isArray(errors) ? errors : []
  const formError = typeof errors === 'string' ? errors : null

  return (
    <form onSubmit={submitTicketForm}>
      <Card className="w-full">
        <CardContent>
          <div className="flex flex-col gap-4">
            <FormField
              name="title"
              label="Title"
              placeholder="Ex. My PC won't turn on after updates"
              required
              value={ticket.title}
              onChange={onChangeSetTicketField}
              errors={fieldErrors}
              disabled={isLoading}
              minLength={TITLE_LENGTH.min}
              maxLength={TITLE_LENGTH.max}
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
              minLength={DESCRIPTION_LENGTH.min}
              maxLength={DESCRIPTION_LENGTH.max}
              className="min-h-44"
            />
            {formError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Unable to create ticket</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <TicketCheck />
                <AlertTitle>Ticket created successfully</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" asChild disabled={isLoading}>
            <Link to="/">
              <ArrowLeft />
              <span>Back Homepage</span>
            </Link>
          </Button>
          <Button type="button" variant="outline" className="ml-auto" onClick={resetFormFields} disabled={isLoading}>
            <Eraser />
            <span>Reset</span>
          </Button>
          <Button type="submit" className="w-full md:w-fit" disabled={!canSubmitForm || isLoading}>
            {isLoading ? <Spinner /> : <Send />}
            <span>Send ticket</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default CreateTicketForm
