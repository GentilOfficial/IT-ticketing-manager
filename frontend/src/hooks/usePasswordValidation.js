const usePasswordValidation = (password, confirmPassword) => {
  const requirements = [
    { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { key: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'number', label: 'One number', test: (p) => /\d/.test(p) },
    { key: 'symbol', label: 'One special character', test: (p) => /[^a-zA-Z0-9\s]/.test(p) },
    { key: 'noSpaces', label: 'No spaces', test: (p) => p !== '' && !/\s/.test(p) },
  ]

  const passwordChecks = requirements.map((req) => ({
    ...req,
    passed: req.test(password),
  }))

  const isValidPassword = passwordChecks.every((row) => row.passed)
  const passwordsMatch = password === confirmPassword

  return { passwordChecks, isValidPassword, passwordsMatch }
}

export default usePasswordValidation
