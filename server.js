const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  transports: ['websockets', 'polling']
})

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
})

let peers = {}

io.on('connection', socket => {
  console.log(socket.id + ' connected')

  socket.on('join', id => {
    peers[id] = socket
    let peerCount = Object.keys(peers).length
    console.log(id + ' joined!')
    socket.emit('welcome', `welcome ${id}, currently ${peerCount} peer${peerCount > 1 ? 's' : ''}`)
  })

  socket.on('offer', (id, desc) => {
    console.log(id, desc)
  })

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected')
    delete peers[socket.id]
  })
})


http.listen(8000, () => console.log(`Server running 8000`))