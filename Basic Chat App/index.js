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

  
// 미들 웨어
io.use((socket, next) => {
  const userName = socket.handshake.auth.userName
  if (!userName) {
    next(new Error("Invalid UserName"))
  }
  socket.userName = userName
  next()
})

// 소켓 커넥션
io.on("connection", (socket) => {
  socket.broadcast.emit("new connection", `connected`)

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg)
  })

  socket.on("typing", (msg) => {
    socket.broadcast.emit("typing", msg)
  })

  socket.on("disconnect", () => {
    console.log(`disconnected`)
  })
})


server.listen(3000, () => {
  console.log("listening on *:3000")
})