import { TooltipProvider } from '@/components/ui/tooltip'
import AuthRoute from '@/middleware/AuthRoute'
import ProtectedRoute from '@/middleware/ProtectedRoute'
import AdminTicketsPage from '@/pages/admin/AdminTicketsPage'
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
    <TooltipProvider>
      <AuthProvider>
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
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="tickets/:ticketId" element={<TicketDetailsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  )
}

export default App
