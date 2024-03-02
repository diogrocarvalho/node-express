import * as fs from 'fs'
import express from 'express'
import chalk from 'chalk'
import debug from 'debug'
import path from 'path'

const sessionsRouter = express.Router()
const appDebug = debug('app')

let sessions
try {
  sessions = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/sessions.json'), 'utf8'),
  )
} catch (error) {
  appDebug('error', error)
}

sessionsRouter.route('/').get((req, res) => {
  res.render('sessions', {
    title: 'Globomantics',
    sessions,
  })
})

sessionsRouter.route('/:id').get((req, res) => {
  const { id } = req.params

  res.render(`session`, {
    session: sessions.find((session) => session.id == parseInt(id)),
  })
})
sessionsRouter.route('/1').get((req, res) => res.send('single sessions'))

export default sessionsRouter
