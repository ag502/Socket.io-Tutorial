const userName = window.prompt("이름을 입력해 주세요.")

// 소켓 객체 생성
// 자동연결 해제 -> socket.connect()으로 수동 연결
const socket = io({
  autoConnect: false,
  auth: {
    userName
  }
})

socket.connect()

// 이벤트 캐쳐 -> 이벤트 모니터링시 사용
socket.onAny((event, ...args) => {
  console.log(event, args)
})

// 연결 에러
socket.on("connect_error", (err) => {
  // 인증 에러
  while (err.message === "Invalid UserName") {
    socket.auth.userName = window.prompt("이름을 입력해 주세요.")
    socket.connect()
  }
})

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
  identity.innerText = `I'm ${userName}`
  messages.appendChild(identity)
})

// 접속중인 유저
socket.on("users", (users) => {
  const currentUsers = []

  users.forEach(user => {
    user.self = user.userID === socket.id
    currentUsers.push(user)
  })

  currentUsers.sort((a, b) => {
    if (a.self) return -1
    if (b.self) return 1
    if (a.username < b.username) return -1;
    return a.username > b.username ? 1 : 0;
  })
  console.log(currentUsers)
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