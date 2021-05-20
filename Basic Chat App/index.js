const express = require("express")
const http = require("http")
const {Server} = require("socket.io")


const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on("connection", (socket) => {
  console.log("a user connected")
})


server.listen(3000, () => {
  console.log("listening on *:3000")
})