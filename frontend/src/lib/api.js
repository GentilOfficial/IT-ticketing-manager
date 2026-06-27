const request = async (path, { method = 'GET', body, authToken } = {}) => {
  const config = {
    method,
    headers: {},
  }

  if (body) {
    config.headers['Content-Type'] = 'application/json'
    config.body = JSON.stringify(body)
  }

  if (authToken) {
    config.headers.Authorization = authToken
  }

  const response = await fetch(`${import.meta.env.VITE_API_SERVER}${path}`, config)
  const data = await response.json()

  return data
}

export const getCurrentUser = (authToken) => request('/api/auth/me', { authToken })
export const login = (credentials) => request('/api/auth/login', { method: 'POST', body: credentials })
export const register = (userDetails) => request('/api/auth/register', { method: 'POST', body: userDetails })
export const getTickets = (authToken) => request('/api/tickets', { authToken })
export const createTicket = (ticket, authToken) => request('/api/tickets', { method: 'POST', body: ticket, authToken })
export const getTicketById = (ticketId, authToken) => request(`/api/tickets/${ticketId}`, { authToken })
export const updateTicketStatus = (ticketId, status, authToken) =>
  request(`/api/tickets/${ticketId}`, { method: 'PUT', body: { status }, authToken })

export default request
