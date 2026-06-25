import { TooltipProvider } from '@/components/ui/tooltip'
import AuthRoute from '@/middleware/AuthRoute'
import ProtectedRoute from '@/middleware/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import TicketPage from '@/pages/TicketPage'
import AdminTicketPage from '@/pages/admin/AdminTicketPage'
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
              <Route path="/" element={<Navigate to="/tickets" replace />} />
              <Route path="/tickets" element={<TicketPage />} />
            </Route>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin">
                <Route index element={<Navigate to="tickets" replace />} />
                <Route path="tickets" element={<AdminTicketPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  )
}

export default App
