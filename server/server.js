const path = require("path")
const http = require("http")
const express = require("express")
const app = express()
const socketIO = require("socket.io")
const moment = require("moment")

const publicPath = path.join(__dirname, "../public")
const  {isRealString} = require("./utils/validation.js")
const {generateMessage, generateLocationMessage} = require("./utils/message.js")
const port = process.env.PORT || 3000

const server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on("connection", (socket) => {
    console.log("New user connected")

    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback("Name and room name are required.")
        }
        socket.join(params.room)
        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app."))

        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined.`))
        callback()
    })

    socket.on("createMessage", (message, callback) => {
        console.log("createMessage", message)
        io.emit("newMessage", generateMessage(message.from, message.text))
        callback()
    })

    socket.on("createLocationMessage", (coords) => {
            io.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longitude))
    })

    socket.on("disconnect", () => {
        console.log("User was disconnected.")
    })
})

server.listen(port, () => {console.log(`--- SERVER IS UP ON PORT ${port} ---`)})

