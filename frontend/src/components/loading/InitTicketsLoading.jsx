import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const InitTicketsLoading = () => {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading tickets</EmptyTitle>
        <EmptyDescription>Please wait while we retrieve ticket details.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default InitTicketsLoading
