import usePasswordValidation from './usePasswordValidation'

const getCheck = (result, key) => result.passwordChecks.find((entry) => entry.key === key)

describe('usePasswordValidation', () => {
  it('validates length rule from failing to passing', () => {
    const failing = usePasswordValidation('Ab1!', 'Ab1!')
    const passing = usePasswordValidation('Abcdef1!', 'Abcdef1!')

    expect(getCheck(failing, 'length').passed).toBe(false)
    expect(getCheck(passing, 'length').passed).toBe(true)
  })

  it('validates uppercase rule from failing to passing', () => {
    const failing = usePasswordValidation('abcdef1!', 'abcdef1!')
    const passing = usePasswordValidation('Abcdef1!', 'Abcdef1!')

    expect(getCheck(failing, 'upper').passed).toBe(false)
    expect(getCheck(passing, 'upper').passed).toBe(true)
  })

  it('validates lowercase rule from failing to passing', () => {
    const failing = usePasswordValidation('ABCDEF1!', 'ABCDEF1!')
    const passing = usePasswordValidation('Abcdef1!', 'Abcdef1!')

    expect(getCheck(failing, 'lower').passed).toBe(false)
    expect(getCheck(passing, 'lower').passed).toBe(true)
  })

  it('validates number rule from failing to passing', () => {
    const failing = usePasswordValidation('Abcdefg!', 'Abcdefg!')
    const passing = usePasswordValidation('Abcdef1!', 'Abcdef1!')

    expect(getCheck(failing, 'number').passed).toBe(false)
    expect(getCheck(passing, 'number').passed).toBe(true)
  })

  it('validates special character rule from failing to passing', () => {
    const failing = usePasswordValidation('Abcdef12', 'Abcdef12')
    const passing = usePasswordValidation('Abcdef1!', 'Abcdef1!')

    expect(getCheck(failing, 'symbol').passed).toBe(false)
    expect(getCheck(passing, 'symbol').passed).toBe(true)
  })

  it('marks a password that satisfies all rules as valid', () => {
    const result = usePasswordValidation('Abcdef1!', 'Abcdef1!')

    expect(result.isValidPassword).toBe(true)
    expect(result.passwordsMatch).toBe(true)
  })
})
