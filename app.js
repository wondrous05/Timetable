const express = require('express')
const app = express()
const env = require('dotenv').config();
const port = 4000
const Db = require('./db/db')
const StudentRouter = require('./Route/StudentRoute');
const tableRouter = require('./Route/TimeTable.Route')
const AdminRouter = require('./Route/AdminRoute') 
const morgan = require('morgan')
const cors = require('cors');


app.use(express.json())
app.use(morgan('dev'))
app.use(cors());
app.use('/api/v1/student', StudentRouter)
app.use('/api/v1/table', tableRouter)
app.use('/api/v1/admin', AdminRouter)
Db()
app.get('/', (req, res) => {
    res.send('homepage')
});

app.listen(port, () => {
    console.log(`port is listening on http://localhost:${port}`)
});