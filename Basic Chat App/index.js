const express = require("express")
const http = require("http")

const app = express()
const server = http.createServer(app)

app.use(express.static(__dirname))

app.get("/", (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/index.html')
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})