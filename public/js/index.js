var socket = io();

function scrollToBottom () {
    var messages = $("#messages")
    var newMessage = messages.children("li:last-child")
    // Heights
    var clientHeight = messages.prop("clientHeight")
    var scrollTop = messages.prop("scrollTop")
    var scrollHeight = messages.prop("scrollHeight")
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()

    if (clientHeight + scrollTop + newMessageHeight  + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}

socket.on("connect", function () {
    console.log("Connected to server.")
})

socket.on("disconnect", function () {
    console.log("Disconnected from the server.")
})

socket.on("newMessage", function (message) {
    var formattedTime = moment(message.createdAt).format("h:mm a")
    // var li = $("<li></li>")
    // li.text(`${message.from} - ${formattedTime}: ${message.text}`)
    // console.log(message)

    // $("#messages").append(li)

    var template = $("#message-template").html()
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    })

    $("#messages").append(html)
    scrollToBottom()
})

socket.on("newLocationMessage", function (coords) {
    var formattedTime = moment(coords.createdAt).format("h:mm a")
    // var li = $(`<li>${coords.from} - ${formattedTime}: <a href=${coords.url}>Click here</></li>`)
    // $("#messages").append(li)
    var template = $("#location-message-template").html()
    var html = Mustache.render(template, {
        url: coords.url,
        from: coords.from,
        createdAt: formattedTime
    })
    $("#messages").append(html)
    scrollToBottom()
})

socket.emit("createMessage", {
    from: "Burzo!!",
    text: "HI!!"
}, function(data) {
    console.log(data)
})

$("#message-form").on("submit", function(e) {
    e.preventDefault()

    var messageTextbox =  $("[name=message]")

    socket.emit("createMessage", {
        from:"user",
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val("")
    })
})

var locationButton = $("#send-location")
locationButton.on("click", function () {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser.")
    }
    $(locationButton.attr("disabled", true)).text("Sending location...")
    navigator.geolocation.getCurrentPosition(function (position) {
        $(locationButton.removeAttr("disabled")).text("Send location")
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        $(locationButton.removeAttr("disabled")).text("Send location")
        alert("Unable to fetch location")
    })
})