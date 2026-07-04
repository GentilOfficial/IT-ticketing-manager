const TOKEN_KEY = 'auth_token'
const TOKEN_EVENT = 'auth-token-changed'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }

  window.dispatchEvent(
    new CustomEvent(TOKEN_EVENT, {
      detail: token,
    }),
  )
}

export const onTokenChange = (callback) => {
  const handler = (event) => callback(event.detail)

  window.addEventListener(TOKEN_EVENT, handler)

  return () => {
    window.removeEventListener(TOKEN_EVENT, handler)
  }
}

export default getToken
