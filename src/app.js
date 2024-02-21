import chalk from 'chalk'
import express from 'express'
import debug from 'debug'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const appDebug = debug('app')
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public/')))

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(PORT, () => {
  appDebug(`Listening on port ${chalk.green(PORT)}`)
})
