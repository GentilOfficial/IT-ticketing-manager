import { createTicketComment as createTicketCommentRequest, getTicketComments } from '@/lib/api'
import { useEffect, useState } from 'react'

const useTicketComments = (ticketId) => {
  const [comments, setComments] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [sendingError, setSendingError] = useState(null)

  useEffect(() => {
    const initTicket = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getTicketComments(ticketId)

        if (!data.success) {
          setError(data.message || 'Error during comments loading.')
        } else {
          setComments(data.comments)
        }
      } catch (e) {
        console.error('Error during comments loading:', e)
        setError('Network error. Please check your internet connection.')
      } finally {
        setIsLoading(false)
      }
    }

    initTicket()
  }, [ticketId])

  const appendComment = (newComment) => {
    setComments([...comments, newComment])
  }

  const createTicketComment = async (message) => {
    setIsSending(true)
    setSendingError(null)
    try {
      const data = await createTicketCommentRequest(ticketId, message)

      if (!data.success) {
        setSendingError(data.errors || data.message || 'Error sending comment.')
      } else {
        appendComment(data.comment)
      }
      return data.success
    } catch (e) {
      console.error('Error sending comment:', e)
      setSendingError('Network error. Please check your internet connection.')
      return false
    } finally {
      setIsSending(false)
    }
  }

  return { comments, isLoading, error, createTicketComment, isSending, sendingError }
}

export default useTicketComments
