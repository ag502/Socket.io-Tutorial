const express = require("express")
const http = require("http")

const app = express()
const server = http.createServer(app)

app.get("/", (req, res) => {
  res.send("<h1>Hello from the other side</h1>")
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})