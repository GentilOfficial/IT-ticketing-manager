import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authMock = vi.hoisted(() => ({
  useAuth: vi.fn(),
}))

vi.mock('@/context/AuthContext', () => authMock)

import AuthRoute from './AuthRoute'
import ProtectedRoute from './ProtectedRoute'

const renderProtected = (role = 'admin') => {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route path="/" element={<div>home page</div>} />
        <Route path="/auth/login" element={<div>login page</div>} />
        <Route path="/admin" element={<div>admin page</div>} />
        <Route path="/protected" element={<ProtectedRoute role={role} />}>
          <Route index element={<div>protected content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

const renderAuth = () => {
  return render(
    <MemoryRouter initialEntries={['/auth/login']}>
      <Routes>
        <Route path="/" element={<div>home page</div>} />
        <Route path="/auth/login" element={<AuthRoute />}>
          <Route index element={<div>auth content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('route guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users on protected route to login', () => {
    authMock.useAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
    })

    renderProtected('admin')

    expect(screen.getByText('login page')).toBeTruthy()
  })

  it('redirects authenticated users with wrong role', () => {
    authMock.useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
    })

    renderProtected('admin')

    expect(screen.getByText('home page')).toBeTruthy()
  })

  it('renders protected content for authenticated users with correct role', () => {
    authMock.useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: true,
    })

    renderProtected('admin')

    expect(screen.getByText('protected content')).toBeTruthy()
  })

  it('AuthRoute renders outlet when user is not authenticated', () => {
    authMock.useAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    renderAuth()

    expect(screen.getByText('auth content')).toBeTruthy()
  })

  it('AuthRoute redirects authenticated user to home', () => {
    authMock.useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    renderAuth()

    expect(screen.getByText('home page')).toBeTruthy()
  })
})
