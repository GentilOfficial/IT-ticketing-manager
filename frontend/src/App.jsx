import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import AuthRoute from '@/middleware/AuthRoute'
import ProtectedRoute from '@/middleware/ProtectedRoute'
import UsersPage from '@/pages/admin/UsersPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import NotFoundPage from '@/pages/NotFoundPage'
import NewTicketPage from '@/pages/ticket/NewTicketPage'
import TicketDetailsPage from '@/pages/ticket/TicketDetailsPage'
import TicketsPage from '@/pages/ticket/TicketsPage'
import AuthProvider from '@/providers/AuthProvider'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

const App = () => {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="auth" element={<AuthRoute />}>
              <Route index element={<Navigate to="login" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>
            <Route element={<ProtectedRoute role="user" />}>
              <Route index element={<Navigate to="tickets" replace />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
              <Route path="/new/ticket" element={<NewTicketPage />} />
            </Route>
            <Route path="admin" element={<ProtectedRoute role="admin" />}>
              <Route index element={<Navigate to="tickets" replace />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <Toaster />
    </AuthProvider>
  )
}

export default App
