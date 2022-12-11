const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors');


require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


app.get('/', async (req, res) => {
    res.send('This is first commit')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})







