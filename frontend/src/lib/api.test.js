import { beforeEach, describe, expect, it, vi } from 'vitest'

const authTokenMock = vi.hoisted(() => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
}))

vi.mock('@/lib/authToken', () => authTokenMock)

import request from './api'

const jsonResponse = (status, body) => ({
  status,
  json: vi.fn().mockResolvedValue(body),
})

describe('request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authTokenMock.getToken.mockReturnValue('old-token')
    globalThis.fetch = vi.fn()
  })

  it('returns a normal non-419 response without triggering refresh', async () => {
    const expected = { success: true, payload: { id: 1 } }
    globalThis.fetch.mockResolvedValueOnce(jsonResponse(200, expected))

    const result = await request('/api/tickets')

    expect(result).toEqual(expected)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch.mock.calls[0][0]).toContain('/api/tickets')
    expect(authTokenMock.setToken).not.toHaveBeenCalled()
  })

  it('on 419, calls /auth/refresh exactly once and retries original request once', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(jsonResponse(419, { success: false, message: 'expired' }))
      .mockResolvedValueOnce(jsonResponse(200, { success: true, token: 'new-token' }))
      .mockResolvedValueOnce(jsonResponse(200, { success: true, payload: { retried: true } }))

    const result = await request('/api/tickets')

    expect(result).toEqual({ success: true, payload: { retried: true } })
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)

    const calledUrls = globalThis.fetch.mock.calls.map(([url]) => url)
    expect(calledUrls.filter((url) => url.includes('/api/auth/refresh'))).toHaveLength(1)
    expect(calledUrls.filter((url) => url.includes('/api/tickets'))).toHaveLength(2)

    expect(authTokenMock.setToken).toHaveBeenCalledTimes(1)
    expect(authTokenMock.setToken).toHaveBeenCalledWith('new-token')
  })

  it('when refresh fails, clears token and returns error without infinite retries', async () => {
    const refreshError = { success: false, message: 'refresh failed' }

    globalThis.fetch
      .mockResolvedValueOnce(jsonResponse(419, { success: false, message: 'expired' }))
      .mockResolvedValueOnce(jsonResponse(419, refreshError))

    const result = await request('/api/tickets')

    expect(result).toEqual(refreshError)
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)

    const calledUrls = globalThis.fetch.mock.calls.map(([url]) => url)
    expect(calledUrls.filter((url) => url.includes('/api/auth/refresh'))).toHaveLength(1)

    expect(authTokenMock.setToken).toHaveBeenCalledTimes(1)
    expect(authTokenMock.setToken).toHaveBeenCalledWith(null)
  })
})
