import express from 'express'
import debug from 'debug'
import { MongoClient } from 'mongodb'

const sessionsRouter = express.Router()
const appDebug = debug('app:sessionsRouter')

sessionsRouter.use((req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/')
  }
})

function getDbConnection() {
  const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@globomantics.gcs1plu.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics`
  const client = new MongoClient(uri)
  const db = client.db(process.env.DB_NAME)
  return db
}

async function getSessions() {
  try {
    const db = getDbConnection()
    const response = await db.collection('sessions').find().toArray()
    appDebug('Successfully fetching sessions, quantity:', response.length)
    return response
  } catch (error) {
    appDebug(error.stack)
  }
}

async function getSessionById(id) {
  try {
    const db = getDbConnection()
    const response = await db
      .collection('sessions')
      .findOne({ id: parseInt(id) })
    appDebug(`Session ${id} found!`, response)
    return response
  } catch (error) {
    appDebug(error.stack)
  }
}

sessionsRouter.route('/').get(async (req, res) => {
  try {
    const sessions = await getSessions()
    res.render('sessions', {
      title: 'Globomantics',
      sessions,
    })
  } catch (error) {
    appDebug(error.stack)
  }
})

sessionsRouter.route('/:id').get(async (req, res) => {
  const { id } = req.params
  const session = await getSessionById(id)
  try {
    res.render(`session`, {
      session,
    })
  } catch (error) {
    appDebug(error.stack)
  }
})

export default sessionsRouter
