const mongoDB = require('./mongo')(process.env.MONGO_DATABASE)

module.exports = {
  mongoDB
}
