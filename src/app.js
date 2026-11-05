const express = require('express')

const vendehumosRouter = require('./routes/vendehumos')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: { ok: true } })
})

app.use('/auth', authRouter)
app.use('/vendehumos', vendehumosRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

module.exports = app
