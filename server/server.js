const path = require("path")
const express = require("express")
const app = express()

const publicPath = path.join(__dirname, "../public")
const port = process.env.PORT || 3000

app.use("/static", express.static(publicPath))

app.get("/", ((req, res) => {
    res.sendFile(publicPath+"/index.html")
}))

app.listen(port, ()=>{console.log(`--- SERVER IS UP ON PORT ${port} ---`)})

