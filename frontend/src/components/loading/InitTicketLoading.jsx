import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import AppLayout from '@/layouts/AppLayout'

const InitTicketLoading = () => {
  return (
    <AppLayout>
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Loading ticket</EmptyTitle>
          <EmptyDescription>Please wait while we retrieve ticket details.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </AppLayout>
  )
}

export default InitTicketLoading
