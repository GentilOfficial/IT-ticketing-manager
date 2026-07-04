import { getToken, setToken } from '@/lib/authToken'

const request = async (path, { method = 'GET', body } = {}, retry = false) => {
  const config = {
    method,
    credentials: 'include',
    headers: {},
  }

  if (body) {
    config.headers['Content-Type'] = 'application/json'
    config.body = JSON.stringify(body)
  }

  const authToken = getToken()

  if (authToken) {
    config.headers.Authorization = authToken
  }

  const response = await fetch(`${import.meta.env.VITE_API_SERVER}${path}`, config)

  if (response.status === 419 && !retry) {
    const refreshData = await refreshToken(true)

    if (!refreshData.success) {
      setToken(null)
      return refreshData
    } else {
      setToken(refreshData.token)
      return request(path, { method, body })
    }
  }

  const data = await response.json()

  return data
}

export const getCurrentUser = () => request('/api/auth/me')

export const login = (credentials) => request('/api/auth/login', { method: 'POST', body: credentials })

export const register = (userDetails) => request('/api/auth/register', { method: 'POST', body: userDetails })

export const refreshToken = (retry) => request('/api/auth/refresh', { method: 'POST' }, retry)

export const sessionLogout = () => request('/api/auth/logout', { method: 'POST' })

export const getTickets = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })

  const queryString = searchParams.toString()
  const path = `/api/tickets${queryString ? `?${queryString}` : ''}`

  return request(path)
}

export const createTicket = (ticket) => request('/api/tickets', { method: 'POST', body: ticket })

export const getTicketById = (ticketId) => request(`/api/tickets/${ticketId}`)

export const updateTicketStatus = (ticketId, status) =>
  request(`/api/tickets/${ticketId}`, { method: 'PUT', body: { status } })

export const editTicket = (ticketId, edits) => request(`/api/tickets/${ticketId}`, { method: 'PUT', body: edits })

export const updateTicketAssignedTo = (ticketId, assignedTo) =>
  request(`/api/tickets/${ticketId}`, { method: 'PUT', body: { assignedTo } })

export const getTicketComments = (ticketId) => request(`/api/tickets/${ticketId}/comments`)

export const createTicketComment = (ticketId, message) =>
  request(`/api/tickets/${ticketId}/comments`, { method: 'POST', body: message })

export const getAllUsers = () => request('/api/users/all')

export const getAdminUsers = () => request('/api/users/admin')

export default request
