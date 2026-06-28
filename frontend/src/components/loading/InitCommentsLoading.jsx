import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const InitCommentsLoading = () => {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading comments</EmptyTitle>
        <EmptyDescription>Please wait while we retrieve ticket comments.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default InitCommentsLoading
