const MongoClient = require('mongodb').MongoClient

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD
} = process.env

const MONGO_URL = process.env.MONGO_URL || `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/`

module.exports = (dbName) => {
  const _connect = () => {
    const options = {
      useUnifiedTopology: true
    }

    return new Promise((resolve, reject) => {
      MongoClient.connect(MONGO_URL, options, (err, client) => {
        if (err) reject(err)
        // console.log(`connected to Mongo DB!`)

        resolve(client.db(dbName))
      })
    })
  }

  const _insertDocuments = (document, data = [], connection = null) => {
    const promise = connection ? Promise.resolve(connection) : _connect()

    return promise.then(conn => {
      const collection = conn.collection(document)
      return new Promise((resolve, reject) => {
        collection.insertMany(data, (err, result) => {
          if (err) reject(err)

          resolve(result)
        })
      })
    })
  }

  const _findDocuments = (document, query = {}, connection = null) => {
    const promise = connection ? Promise.resolve(connection) : _connect()

    return promise.then(conn => {
      const collection = conn.collection(document)
      return new Promise((resolve, reject) => {
        collection.find(query).toArray((err, result) => {
          if (err) reject(err)

          resolve(result)
        })
      })
    })
  }

  return {
    connect: _connect,
    insert: _insertDocuments,
    find: _findDocuments
  }
}
