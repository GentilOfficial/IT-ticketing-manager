import PageHeader from '@/components/shared/PageHeader'
import UsersList from '@/components/users/UsersList'
import AppLayout from '@/layouts/AppLayout'
import { useEffect } from 'react'

const UsersPage = () => {
  useEffect(() => {
    document.title = 'Helpdesk | Administration - All Users'
  }, [])

  return (
    <AppLayout>
      <PageHeader title="All Users" description="Review and manage all users in the system." />
      <UsersList />
    </AppLayout>
  )
}

export default UsersPage
