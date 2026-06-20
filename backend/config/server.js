const { initDB } = require('./db')

const initServer = async (server, port, DBConnection) => {
  try {
    await initDB(DBConnection)
    server.listen(port)
  } catch (e) {
    process.exit(1)
  }
}

module.exports = { initServer }
