const socket = io()

const messages = document.querySelector("#messages")
const form = document.querySelector("#form")
const input = document.querySelector("#input")
const typing = document.querySelector("#typing")

form.addEventListener("submit", (e) => {
  e.preventDefault()
  if (input.value) {
    socket.emit("chat message", input.value)
    input.value = ''
  }
})

let timer = null

input.addEventListener("input", (e) => {
  if (timer) {
    clearTimeout(timer)
    socket.emit("typing", true)
  }
  timer = setTimeout(() => {
    socket.emit("typing", false)
  }, 1000)
})

socket.on("typing", (msg) => {
  if (msg) {
    typing.innerText = `${socket.id} is typing`
  } else {
    typing.innerText = ''
  }
})


socket.on("connect", () => {
  const identity = document.createElement("li")
  identity.classList.add("myIdentity")
  identity.innerText = `I'm ${socket.id}`
  messages.appendChild(identity)
})


socket.on("new connection", (msg) => {
  const item = document.createElement("li")
  item.classList.add("newConnect")
  item.innerText = msg
  messages.appendChild(item)
})

socket.on("chat message", (msg) => {
  const item = document.createElement("li")
  item.innerText = msg;
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight);
})