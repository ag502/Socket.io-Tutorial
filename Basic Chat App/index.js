const express = require("express")
const http = require("http")
const {Server} = require("socket.io")


const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(`${__dirname}/client`))

app.get("/", (req, res) => {
  res.sendFile(__dirname + 'client/index.html')
})

io.on("connection", (socket) => {
  const currentUser = socket.handshake.query.userName

  console.log(`${currentUser} user connected`)

  socket.broadcast.emit("new connection", `${currentUser} connected`)

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg)
  })

  socket.on("typing", (msg) => {
    socket.broadcast.emit("typing", msg)
  })

  socket.on("disconnect", () => {
    console.log(`${currentUser} disconnected`)
  })
})


server.listen(3000, () => {
  console.log("listening on *:3000")
})