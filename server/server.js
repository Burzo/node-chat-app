const path = require("path")
const http = require("http")
const express = require("express")
const app = express()
const socketIO = require("socket.io")
const moment = require("moment")

const publicPath = path.join(__dirname, "../public")
const {Users} = require("./utils/users.js")
const  {isRealString} = require("./utils/validation.js")
const {generateMessage, generateLocationMessage} = require("./utils/message.js")
const port = process.env.PORT || 3000

const server = http.createServer(app)
var io = socketIO(server)
var users = new Users()

app.use(express.static(publicPath))

io.on("connection", (socket) => {
    console.log("New user connected")

    socket.on("join", (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and room name are required.")
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        //console.log(users)
        users.addUser(socket.id, params.name, params.room)
        //console.log(users)
        io.to(params.room).emit("updateUserList", users.getUserList(params.room))

        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app."))

        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined.`))

        callback()
    })

    socket.on("createMessage", (message, callback) => {
        var user = users.getUser(socket.id)

        if (user && isRealString(message.text)) {
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text))
        }

        callback()
    })

    socket.on("createLocationMessage", (coords) => {
            io.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longitude))
    })

    socket.on("disconnect", () => {
        var user = users.removeUser(socket.id)
        if (user) {
            console.log("REMOVING", user)
            io.to(user.room).emit("updateUserList", users.getUserList(user.room))
            io.to(user.room).emit("New message", generateMessage("Admin", `${user.name} has left the chat room.`))
        }
    })
})

server.listen(port, () => {console.log(`--- SERVER IS UP ON PORT ${port} ---`)})

