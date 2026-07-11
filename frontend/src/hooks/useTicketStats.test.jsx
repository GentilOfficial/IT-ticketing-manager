import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiMock = vi.hoisted(() => ({
  getTicketStats: vi.fn(),
}))

vi.mock('@/lib/api', () => apiMock)

import useTicketStats from './useTicketStats'

describe('useTicketStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fills missing byStatus keys using default stats', async () => {
    apiMock.getTicketStats.mockResolvedValueOnce({
      success: true,
      total: 5,
      byStatus: {
        open: 3,
        resolved: 2,
      },
    })

    const { result } = renderHook(() => useTicketStats())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.stats.total).toBe(5)
    expect(result.current.stats.byStatus).toEqual({
      open: 3,
      in_progress: 0,
      on_hold: 0,
      resolved: 2,
    })
  })
})
