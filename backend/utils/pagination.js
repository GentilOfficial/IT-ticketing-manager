const normalizeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10)

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback
}

module.exports = { normalizeRegex, getPositiveInteger }
