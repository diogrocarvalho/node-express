import express from 'express'
import debug from 'debug'
import { MongoClient } from 'mongodb'
import passport from 'passport'

const authRouter = express.Router()
const appDebug = debug('app:auth')

function getDbConnection() {
  const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@globomantics.gcs1plu.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics`
  const client = new MongoClient(uri)
  const db = client.db(process.env.DB_NAME)
  return { db, client }
}

async function createUser(user) {
  let dbClient
  try {
    const { db, client } = getDbConnection()
    dbClient = client
    appDebug('tentando criar o user ' + user)
    const results = await db.collection('users').insertOne(user)
    appDebug('sei lá se deu bom...' + results)
    return { id: results.insertedId, ...user }
  } catch (error) {
    appDebug(error.stack)
  } finally {
    if (dbClient) {
      dbClient.close()
    }
  }
}

authRouter.route('/signUp').post((req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.redirect('/')
    }

    user = await createUser(user)
    console.log('@@@', user.id)

    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/auth/profile')
    })
  })(req, res, next)
})

authRouter
  .route('/signIn')
  .get((req, res) => {
    res.render('signin')
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }),
  )

authRouter.route('/profile').get((req, res) => {
  appDebug('@@@@ ' + req.user)
  res.json(req.user)
})

export default authRouter
