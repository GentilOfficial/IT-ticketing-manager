import FormField from '@/components/form/FormField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/providers/AuthProvider'
import { ArrowLeft, Eraser, Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

const TITLE_LENGTH = { min: 5, max: 120 }
const DESCRIPTION_LENGTH = { min: 10, max: 4000 }

const CreateTicketForm = () => {
  const { token } = useAuth()
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [success, setSuccess] = useState(null)

  const canSubmitForm = Object.values(ticket).every(Boolean)

  const onChangeSetTicketField = (e) => {
    const { name, value } = e.target
    setTicket({
      ...ticket,
      [name]: value,
    })
  }

  const resetFormFields = () => {
    setTicket({
      title: '',
      description: '',
    })
  }

  const submitTicketForm = async (e) => {
    e.preventDefault()
    setErrors(null)
    setSuccess(null)
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(ticket),
      })

      const data = await response.json()

      if (!data.success) {
        setErrors(data.errors || data.message || 'Unable to create ticket. Please try again.')
      } else {
        setSuccess(`Ticket created successfully. Ticket ID: ${data.ticket._id}`)
      }
    } catch (err) {
      console.error('An error occurred during registration:', err)
      setErrors('Network error. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const generalError = typeof errors === 'string' ? errors : null
  const fieldErrors = Array.isArray(errors) ? errors : []

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
            {generalError && <p className="text-sm text-destructive">{generalError}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" asChild disabled={isLoading}>
            <Link to="/">
              <ArrowLeft />
              <span>Torna alla home</span>
            </Link>
          </Button>
          <Button type="button" variant="outline" className="ml-auto" onClick={resetFormFields} disabled={isLoading}>
            <Eraser />
            <span>Reset</span>
          </Button>
          <Button type="submit" className="w-full md:w-fit" disabled={!canSubmitForm || isLoading}>
            <Send />
            <span>Invia ticket</span>
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default CreateTicketForm
