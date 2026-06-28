import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { MessageSquare } from 'lucide-react'

const EmptyComments = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icons">
          <MessageSquare />
        </EmptyMedia>
        <EmptyTitle>No comments yet</EmptyTitle>
        <EmptyDescription>
          This ticket doesn't have any comments yet. Start the conversation by posting the first comment.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default EmptyComments
