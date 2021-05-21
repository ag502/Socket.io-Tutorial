const socket = io()

const messages = document.querySelector("#messages")
const form = document.querySelector("#form")
const input = document.querySelector("#input")

form.addEventListener("submit", (e) => {
  e.preventDefault()
  if (input.value) {
    socket.emit("chat message", input.value)
    input.value = ''
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