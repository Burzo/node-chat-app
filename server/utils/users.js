class Users {
    constructor() {
        this.users = []
    }

    addUser(id, name, room) {
        var user = {id, name, room}
        this.users.push(user)
        return user
    }

    removeUser(id) {
        var userToRemove = this.getUser(id)
        if (userToRemove) {
            this.users = this.users.filter((user) => user.id !== id)
        }
        return userToRemove
    }

    getUser(id) {
        var user = this.users.filter((user) => user.id === id)[0]
        return user
    }
    
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room)
        var namesArray = users.map((user) => user.name)
        return namesArray
    }
}

// var user = new Users()

// user.addUser("123","burzo", "roomeone")
// user.addUser("456","burzo2", "roomeone")
// user.addUser("789","burzo3", "roometwo")
// user.addUser("145","burzo4", "roometwo")

// console.log(user.users)
// console.log("\n\n")

// console.log(user.getUser("456"))
// console.log("\n\n")

// user.removeUser("456")

// console.log(user.users)

module.exports = {Users}