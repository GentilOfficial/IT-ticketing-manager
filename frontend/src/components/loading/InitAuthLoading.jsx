import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout from '@/layouts/AuthLayout'

const InitAuthLoading = () => {
  return (
    <AuthLayout>
      <Empty className="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Loading your account</EmptyTitle>
          <EmptyDescription>Please wait while we retrieve your information.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </AuthLayout>
  )
}

export default InitAuthLoading
