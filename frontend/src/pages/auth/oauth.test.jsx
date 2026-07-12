import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const authMock = vi.hoisted(() => ({
  useAuth: vi.fn(),
}))

const authTokenMock = vi.hoisted(() => ({
  setToken: vi.fn(),
}))

const toastMock = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('@/context/AuthContext', () => authMock)
vi.mock('@/lib/authToken', () => authTokenMock)
vi.mock('sonner', () => toastMock)

import LoginForm from '@/components/auth/LoginForm'
import OAuthCallbackPage from './OAuthCallbackPage'

describe('OAuth', () => {
  let originalLocation

  beforeAll(() => {
    originalLocation = window.location

    delete window.location
    window.location = {
      ...originalLocation,
      href: 'http://localhost/',
      replace: vi.fn(),
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_API_SERVER', 'http://api.local')
    window.location.href = 'http://localhost/'
  })

  it('redirects to backend Google endpoint when clicking Sign in with Google', () => {
    authMock.useAuth.mockReturnValue({
      login: vi.fn(),
      errors: null,
    })

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }))

    expect(window.location.href).toBe('http://api.local/api/auth/google')
  })

  it('stores token and redirects home when callback contains token', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback?token=jwt-token-123']}>
        <Routes>
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(authTokenMock.setToken).toHaveBeenCalledWith('jwt-token-123')
      expect(window.location.replace).toHaveBeenCalledWith('/')
    })
  })

  it('shows error and redirects to login when callback token is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(toastMock.toast.error).toHaveBeenCalledWith('Google authentication failed. Missing token.', {
        position: 'top-center',
      })
      expect(window.location.replace).toHaveBeenCalledWith('/auth/login')
    })
  })
})
