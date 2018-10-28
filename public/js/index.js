var socket = io();

socket.on("connect", function () {
    console.log("Connected to server.")
})

socket.on("disconnect", function () {
    console.log("Disconnected from the server.")
})

socket.on("newMessage", function (message) {
    var li = $("<li></li>")
    li.text(`${message.from}: ${message.text}`)
    console.log(message)

    $("#messages").append(li)
})

socket.emit("createMessage", {
    from: "Burzo!!",
    text: "HI!!"
}, function(data) {
    console.log(data)
})

$("#message-form").on("submit", function(e) {
    e.preventDefault()

    socket.emit("createMessage", {
        from:"user",
        text: $("[name=message]").val()
    }, function () {

    })
})

var locationButton = $("#send-location")
locationButton.on("click", function () {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser.")
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position)
    }, function () {
        alert("Unable to fetch location")
    })
})