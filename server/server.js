const path = require("path")
const http = require("http")
const express = require("express")
const app = express()
const socketIO = require("socket.io")

const publicPath = path.join(__dirname, "../public")
const {generateMessage} = require("./utils/message.js")
const port = process.env.PORT || 3000

const server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on("connection", (socket) => {
    console.log("New user connected")

    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app."))

    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined."))

    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message)
        callback("This is from the server.")
        io.emit("newMessage", generateMessage(message.from, message.text))
    })

    socket.on("disconnect", () => {
        console.log("User was disconnected.")
    })
})


app.get("/", ((req, res) => {
    res.sendFile(publicPath+"/index.html")
}))

server.listen(port, () => {console.log(`--- SERVER IS UP ON PORT ${port} ---`)})

