import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { UserX } from 'lucide-react'

const EmptyUsers = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icons">
          <UserX />
        </EmptyMedia>
        <EmptyTitle>No Users Yet</EmptyTitle>
        <EmptyDescription>
          No users have been registered yet. If you've enabled any filters, try disabling them.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default EmptyUsers
