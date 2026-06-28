import { createTicket, editTicket } from '@/lib/api'
import { useState } from 'react'

const INITIAL_TICKET = {
  title: '',
  description: '',
}

export const TICKET_TITLE_LENGTH = { min: 5, max: 120 }
export const TICKET_DESCRIPTION_LENGTH = { min: 10, max: 4000 }

const useTicketForm = (token, { initialTicket = INITIAL_TICKET, onSuccess } = {}) => {
  const [ticket, setTicket] = useState(initialTicket)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [success, setSuccess] = useState(null)

  const onChangeSetTicketField = (e) => {
    const { name, value } = e.target

    setTicket({
      ...ticket,
      [name]: value,
    })
  }

  const resetFormFields = () => {
    setTicket(initialTicket)
  }

  const resetMessages = () => {
    setErrors(null)
    setSuccess(null)
  }

  const submitTicketForm = async (e) => {
    e.preventDefault()
    resetMessages()
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
      console.error('An error occurred during ticket creation:', err)
      setErrors('Network error. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const submitEditTicketForm = async (e) => {
    e.preventDefault()
    resetMessages()
    setIsLoading(true)

    try {
      const data = await editTicket(ticket._id, ticket, token)

      if (!data.success) {
        setErrors(data.errors || data.message || 'Unable to edit ticket. Please try again.')
      } else {
        if (onSuccess) onSuccess(data.ticket, 'The ticket has been edited.')
      }
    } catch (err) {
      console.error('An error occurred during ticket editing:', err)
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
    submitEditTicketForm,
    resetMessages,
  }
}

export default useTicketForm
