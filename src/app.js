import chalk from 'chalk'
import debug from 'debug'
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import sessionsRouter from './routers/sessionsRouter'
import adminRouter from './routers/adminRouter'
import authRouter from './routers/authRouter'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passportConfig from './config/passport'

dotenv.config()
const app = express()
const appDebug = debug('app')
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public/')))
app.use(express.json())
app.use(express.urlencoded({ extended: false })) //transform urlcode to body on post (form on html)
app.use(cookieParser())
app.use(
  session({ secret: 'globomantics', saveUninitialized: false, resave: false }),
)

passportConfig(app)

app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use('/sessions', sessionsRouter)
app.use('/admin', adminRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.render('index', { title: 'Globomantics' })
})

app.listen(PORT, () => {
  appDebug(`Listening on port ${chalk.green(PORT)}`)
})
