import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiMock = vi.hoisted(() => ({
  getAllUsers: vi.fn(),
}))

vi.mock('@/lib/api', () => apiMock)

import useUsers from './useUsers'

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reset list and request page 1 when query changes', async () => {
    apiMock.getAllUsers
      .mockResolvedValueOnce({
        success: true,
        users: [{ _id: 'u1' }],
        pagination: { hasNext: true },
      })
      .mockResolvedValueOnce({
        success: true,
        users: [{ _id: 'u2' }],
        pagination: { hasNext: false },
      })
      .mockResolvedValueOnce({
        success: true,
        users: [{ _id: 'u3' }],
        pagination: { hasNext: false },
      })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => expect(result.current.users).toEqual([{ _id: 'u1' }]))

    await act(async () => {
      await result.current.loadMoreUsers()
    })

    expect(result.current.users).toEqual([{ _id: 'u1' }, { _id: 'u2' }])

    await act(async () => {
      result.current.setQuery('mario')
    })

    await waitFor(() => expect(result.current.users).toEqual([{ _id: 'u3' }]))
    expect(apiMock.getAllUsers).toHaveBeenLastCalledWith({ page: 1, limit: 20, search: 'mario' })
  })

  it('loadMoreUsers appends users and increments page', async () => {
    apiMock.getAllUsers
      .mockResolvedValueOnce({
        success: true,
        users: [{ _id: 'u1' }],
        pagination: { hasNext: true },
      })
      .mockResolvedValueOnce({
        success: true,
        users: [{ _id: 'u2' }, { _id: 'u3' }],
        pagination: { hasNext: false },
      })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => expect(result.current.users).toEqual([{ _id: 'u1' }]))

    await act(async () => {
      await result.current.loadMoreUsers()
    })

    expect(apiMock.getAllUsers).toHaveBeenNthCalledWith(2, { page: 2, limit: 20, search: '' })
    expect(result.current.users).toEqual([{ _id: 'u1' }, { _id: 'u2' }, { _id: 'u3' }])
  })

  it('loadMoreUsers does nothing when pagination.hasNext is false', async () => {
    apiMock.getAllUsers.mockResolvedValueOnce({
      success: true,
      users: [{ _id: 'u1' }],
      pagination: { hasNext: false },
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => expect(result.current.users).toEqual([{ _id: 'u1' }]))

    await act(async () => {
      await result.current.loadMoreUsers()
    })

    expect(apiMock.getAllUsers).toHaveBeenCalledTimes(1)
  })
})
