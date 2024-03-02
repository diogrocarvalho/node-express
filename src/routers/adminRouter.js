import express from 'express'
import debug from 'debug'
import { MongoClient } from 'mongodb'
import fs from 'fs'
import path from 'path'

const adminRouter = express.Router()
const appDebug = debug('app:adminRouter')

async function writeSessionsOnDb() {
  try {
    const sessions = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../data/sessions.json'), 'utf8'),
    )
    const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@globomantics.gcs1plu.mongodb.net/?retryWrites=true&w=majority&appName=Globomantics`
    const client = new MongoClient(uri)
    const db = client.db(process.env.DB_NAME)
    const collection = db.collection('sessions')
    const insertManyResult = await collection.insertMany(sessions)

    appDebug(
      `${insertManyResult.insertedCount} documents successfully inserted.\n`,
    )
  } catch (error) {
    appDebug(error.stack)
  }
}

adminRouter.route('/').get(async (req, res) => {
  try {
    //writeSessionsOnDb()
    res.send('Successfully added')
  } catch (error) {
    appDebug(error.stack)
  }
})

export default adminRouter
