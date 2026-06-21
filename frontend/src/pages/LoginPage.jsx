import { useContext, useState } from 'react'
import { AuthContext } from '../providers/AuthProvider'

const LoginPage = () => {
  const { login, errors } = useContext(AuthContext)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [fieldErrors, setFieldErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setFieldErrors((prev) => ({
      ...prev,
      [name]: null,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFieldErrors({})

    const res = await login(form)

    if (errors) {
      const mapped = errors.reduce((acc, err) => {
        acc[err.field] = err.message
        return acc
      }, {})

      setFieldErrors(mapped)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors && typeof errors === 'string' && <div className="text-red-500 mb-2">{errors}</div>}

      <div>
        <input
          type="text"
          name="email"
          className="border"
          value={form.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        {fieldErrors.email && <p className="text-red-500">{fieldErrors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          className="border"
          value={form.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        {fieldErrors.password && <p className="text-red-500">{fieldErrors.password}</p>}
      </div>

      <button type="submit" className="border mt-2">
        Login
      </button>
    </form>
  )
}

export default LoginPage
