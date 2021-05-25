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
  if (err.message === "Invalid UserName") {
    const name = window.prompt("이름을 입력해 주세요.")
    socket.auth.userName = name
    socket.connect()
  }
})

const currentUser = document.querySelector("#currentUser")
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

let currentUsers = []

const initReactiveProperties = (user) => {
  user.connected = true;
  user.messages = [];
  user.hasNewMessages = false;
};

currentUser.onclick = (e) => {
  const userInfo = e.target.closest("div.user")

  if (userInfo.classList.contains("active")) {
    userInfo.classList.remove("active")
  } else {
    const users = e.currentTarget.children
    Array.from(users).forEach(user => user.classList.remove("active"))
    userInfo.classList.add("active")
  }
}

// 접속중인 유저
socket.on("users", (users) => {
  users.forEach(user => {
    initReactiveProperties(user)
    user.self = user.userID === socket.id
  })

  currentUsers = users.sort((a, b) => {
    if (a.self) return -1
    if (b.self) return 1
    if (a.userName < b.userName) return -1;
    return a.userName > b.userName ? 1 : 0;
  })

  currentUser.innerHTML = ''
  currentUsers.forEach(user => {
    const userContainer = document.createElement("div")
    userContainer.classList.add("user")
    const userName = document.createElement("div")
    userName.innerText = user.userName
    const online = document.createElement("div")
    online.innerText = user.connected ? "✔" : "✖"

    userContainer.appendChild(userName)
    userContainer.appendChild(online)

    currentUser.appendChild(userContainer)
  })
})

socket.on("chat message", (msg) => {
  const item = document.createElement("li")
  item.innerText = msg;
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight);
})