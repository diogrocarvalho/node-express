import { MongoClient } from 'mongodb'
import passport from 'passport'
import { Strategy } from 'passport-local'

function getDbConnection() {
  const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@globomantics.gcs1plu.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics`
  const client = new MongoClient(uri)
  const db = client.db(process.env.DB_NAME)
  return { db, client }
}

const localStrategy = () => {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        let dbClient
        try {
          const { db, client } = getDbConnection()
          dbClient = client
          const user = await db.collection('users').findOne({ username })
          console.log(user)
          if (user && user.password === password) {
            done(null, user)
          } else {
            done(null, false)
          }
        } catch (error) {
          done(error, false)
        } finally {
          if (dbClient) {
            dbClient.close()
          }
        }
      },
    ),
  )
}

export default localStrategy
