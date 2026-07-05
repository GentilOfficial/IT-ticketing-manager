import { editUser } from '@/lib/api'
import { useState } from 'react'

const INITIAL_USER = {
  name: '',
  role: 'user',
}

const useUserForm = ({ initialUser = INITIAL_USER, onSuccess } = {}) => {
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [success, setSuccess] = useState(null)

  const updateUserField = (field, value) => {
    setUser({
      ...user,
      [field]: value,
    })
  }

  const onChangeSetUserField = (e) => {
    const { name, value } = e.target
    updateUserField(name, value)
  }

  const resetFormFields = () => {
    setUser(initialUser)
  }

  const resetMessages = () => {
    setErrors(null)
    setSuccess(null)
  }

  const submitEditUserForm = async (e) => {
    e.preventDefault()
    resetMessages()
    setIsLoading(true)

    try {
      const data = await editUser(user._id, user)

      if (!data.success) {
        setErrors(data.errors || data.message || 'Unable to edit user. Please try again.')
      } else {
        if (onSuccess) onSuccess(data.user, 'The user has been edited.')
      }
    } catch (err) {
      console.error('An error occurred during user editing:', err)
      setErrors('Network error. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    errors,
    success,
    onChangeSetUserField,
    updateUserField,
    resetFormFields,
    submitEditUserForm,
    resetMessages,
  }
}

export default useUserForm
