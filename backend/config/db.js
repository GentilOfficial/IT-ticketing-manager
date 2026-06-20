const mongoose = require('mongoose')

const initDB = async (connection) => {
  try {
    await mongoose.connect(connection)
  } catch (e) {
    process.exit(1)
  }
}

module.exports = { initDB }
