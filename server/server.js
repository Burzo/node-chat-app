const path = require("path")
const http = require("http")
const express = require("express")
const app = express()
const socketIO = require("socket.io")

const publicPath = path.join(__dirname, "../public")
const port = process.env.PORT || 3000

const server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

io.on("connection", (socket) => {
    console.log("New user connected")

    socket.on("createMessage", (message) => {
        console.log("createMessage", message)
        io.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on("disconnect", () => {
        console.log("User was disconnected.")
    })
})


app.get("/", ((req, res) => {
    res.sendFile(publicPath+"/index.html")
}))

server.listen(port, () => {console.log(`--- SERVER IS UP ON PORT ${port} ---`)})

