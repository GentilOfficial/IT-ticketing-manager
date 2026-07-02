import EmptyComments from '@/components/empty/EmptyComments'
import FormField from '@/components/form/FormField'
import InitCommentsLoading from '@/components/loading/InitCommentsLoading'
import CommentItem from '@/components/tickets/details/comments/CommentItem'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import useTicketComments from '@/hooks/useTicketComments'
import { useAuth } from '@/providers/AuthProvider'
import { AlertCircle, ArrowDown, ArrowUp, MessageSquare } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const TicketComments = ({ ticketId }) => {
  const { token } = useAuth()
  const { comments, isLoading, error, createTicketComment, isSending, sendingError } = useTicketComments(
    ticketId,
    token,
  )
  const [message, setMessage] = useState('')
  const scrollRef = useRef(null)

  const [showScrollButton, setShowScrollButton] = useState(false)

  const fieldErrors = Array.isArray(sendingError) ? sendingError : []
  const formError = typeof sendingError === 'string' ? sendingError : null

  const scrollToBottom = (behavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return

    if (behavior === 'smooth') {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      })
    } else {
      el.scrollTop = el.scrollHeight
    }
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight

    setShowScrollButton(distanceFromBottom > 50)
  }

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('auto')
    }
  }, [isLoading])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    scrollToBottom()
  }, [comments])

  const onChangeSetMessage = (e) => {
    const { value } = e.target
    setMessage(value)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const sended = await createTicketComment({ message })
    if (sended) setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) handleFormSubmit(e)
  }

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="border-b pb-3 shadow-muted">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="size-4" />
          Comments
          {comments?.length > 0 && <span className="text-xs text-muted-foreground">({comments.length})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-col gap-4 py-4 max-h-100 h-full overflow-y-auto"
      >
        {isLoading ? (
          <InitCommentsLoading />
        ) : error ? (
          <div className="max-w-sm py-20 mx-auto w-full">
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Unable to load comments</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : comments?.length > 0 ? (
          comments.map((comment) => <CommentItem key={comment._id} comment={comment} />)
        ) : (
          <EmptyComments />
        )}
      </CardContent>

      <CardFooter className="relative flex flex-col border-t gap-2">
        {showScrollButton && (
          <Button
            size="icon"
            variant="secondary"
            onClick={() => scrollToBottom()}
            className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full"
          >
            <ArrowDown />
          </Button>
        )}
        {formError && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to send message</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleFormSubmit} className="w-full flex gap-4">
          <div className="flex-1 min-w-0">
            <FormField
              name="message"
              placeholder="Type a message... (Shift+Enter -> new line)"
              required
              multiline
              value={message}
              onChange={onChangeSetMessage}
              onKeyDown={handleKeyDown}
              errors={fieldErrors}
              disabled={isSending}
              minLength={1}
              maxLength={400}
              className="max-h-30 overflow-y-auto"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" className="rounded-full" disabled={!message.trim() || isSending}>
                {isSending ? <Spinner /> : <ArrowUp />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isSending ? 'Sending Comment...' : 'Send Comment'}</TooltipContent>
          </Tooltip>
        </form>
      </CardFooter>
    </Card>
  )
}

export default TicketComments
