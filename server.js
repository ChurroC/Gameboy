const express = require("express")
const socketApi = require('./socket.js')
const { instrument } = require('@socket.io/admin-ui')
const path = require('path')

app = express()

app.use(express.static(path.join(__dirname, 'App')))

PORT = process.env.PORT || 8080

app.get('/', (req, res)=>{
    res.sendfile(index.html)
})

const server = app.listen(PORT)

socketApi.attach(server)

instrument(socketApi, { auth: false })