const requestLogger = async (req, res, next) => {
  const { ip, method, url } = req
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${new Date().toISOString()} - [${ip}] ${method} ${url} ${duration}ms`)
  })

  next()
}

module.exports = { requestLogger }
