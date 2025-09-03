const express = require('express')
const app = express()
const env = require('dotenv').config();
const port = 4000
const Db = require('./db/db')
const StudentRouter = require('./Route/StudentRoute');
const morgan = require('morgan')


app.use(express.json())
app.use(morgan('dev'))
app.use('/api/v1/student', StudentRouter)
Db()
app.get('/', (req, res) => {
    res.send('homepage')
});

app.listen(port, () => {
    console.log(`port is listening on http://localhost:${port}`)
})  