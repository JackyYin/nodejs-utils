const mongoDBConstructor = require('./mongo')

module.exports = {
  mongoDBConstructor,
  mongoDB: mongoDBConstructor(process.env.MONGO_DATABASE)
}
