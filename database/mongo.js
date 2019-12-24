const MongoClient = require('mongodb').MongoClient

const genConnectionUrl = (options) => {
  const _genCategoryURL = (url, username, password, host, port) => {
    return url ? url : (host && port) ? (username && password) ? `mongodb://${username}:${password}@${host}:${port}/` : `mongodb://${host}:${port}` : null
  }

  const url = _genCategoryURL(
    options.url,
    options.username,
    options.password,
    options.host || 'localhost',
    options.port || 27017
  )
  return url ? url : `mongodb://localhost:27017`
}

module.exports = (options = {}) => {
  const state = {
    url: genConnectionUrl(options),
    db: options.db || process.env.MONGO_DATABASE
  }

  const _connect = () => {
    const connectOpts = {
      useUnifiedTopology: true
    }

    console.log(`prepare to connecting to mongo url: ${state.url}`)
    return new Promise((resolve, reject) => {
      MongoClient.connect(state.url, connectOpts, (err, client) => {
        if (err) reject(err)
        console.log(`connected to Mongo DB!`)

        resolve(client.db(state.db))
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
