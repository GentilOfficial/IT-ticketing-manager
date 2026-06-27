import { createTicket } from '@/lib/api'
import { useState } from 'react'

const INITIAL_TICKET = {
  title: '',
  description: '',
}

const useTicketForm = (token) => {
  const [ticket, setTicket] = useState(INITIAL_TICKET)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [success, setSuccess] = useState(null)

  const onChangeSetTicketField = (e) => {
    const { name, value } = e.target

    setTicket((currentTicket) => ({
      ...currentTicket,
      [name]: value,
    }))
  }

  const resetFormFields = () => {
    setTicket(INITIAL_TICKET)
  }

  const submitTicketForm = async (e) => {
    e.preventDefault()
    setErrors(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const data = await createTicket(ticket, token)

      if (!data.success) {
        setErrors(data.errors || data.message || 'Unable to create ticket. Please try again.')
      } else {
        setSuccess(`Your ticket has been created. Ticket ID: ${data.ticket._id}`)
        resetFormFields()
      }
    } catch (err) {
      console.error('An error occurred during registration:', err)
      setErrors('Network error. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    ticket,
    isLoading,
    errors,
    success,
    onChangeSetTicketField,
    resetFormFields,
    submitTicketForm,
  }
}

export default useTicketForm
