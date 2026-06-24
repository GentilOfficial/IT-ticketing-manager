const sendSuccess = (res, payload = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    ...payload,
  })
}

const sendError = (res, status = 500, message, errors = null) => {
  const payload = {
    message,
  }

  if (errors) {
    payload.errors = errors
  }

  return res.status(status).json({
    success: false,
    ...payload,
  })
}

module.exports = { sendSuccess, sendError }
