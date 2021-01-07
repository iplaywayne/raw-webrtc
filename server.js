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

  socket.on('broadcast', () => {
    console.log('broadcast')
    socket.emit('broadcast')
  })
  socket.on('watcher', id => {
    console.log('watcher')
    socket.emit('watcher', id)
  })

  socket.on('video-offer', (desc) => {
    console.log('video-offer')
    socket.emit('video-offer', desc)
  })
  socket.on('video-answer', (desc) => {
    console.log('video-answer')
    socket.emit('video-answer', desc)
  })
  socket.on('candidate', desc => {
    socket.emit('candidate', desc)
  })
  socket.on('new-candidate', desc => {
    socket.emit('new-candidate', desc)
  })
  socket.on('offer', (id, desc) => {
    console.log('offer' + id)
    socket.emit('offer', id, desc)
  })
  socket.on('answer', desc => {
    socket.emit('answer', desc)
  })
  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected')
    delete peers[socket.id]
  })
})


http.listen(8000, () => console.log(`Server running 8000`))