import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const InitUsersLoading = () => {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading users</EmptyTitle>
        <EmptyDescription>Please wait while we retrieve user details.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default InitUsersLoading
