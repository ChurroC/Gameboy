const Gameboy = require("./gameboy");
const fs = require("fs");

const io = require('socket.io')({
    cors: {
        origin: ['https://admin.socket.io']
    }
})

const rom = fs.readFileSync('./Super_Mario_Land.gb')

const rooms = {}

io.on('connection', socket => {
    let currentRoom

    socket.on('room', room => {
        socket.join(room)
        socket.leave(currentRoom)
        if (!rooms[room]) {
            rooms[room] = {keysToPress: []}
            currentRoom = room
            rooms[room].gameboy = new Gameboy(rom, 60, 250)
            rooms[room].gameboy.run(frame => {
                console.log(currentRoom)
                io.to(currentRoom).emit('frame', frame)
            }, gameboy => {
                gameboy.pressKeys(rooms[room].keysToPress)
            })
        } else {
            currentRoom = room
            socket.join(room)
        }
    })

    socket.on('keydown', key => {
        console.log(key)
        if (!rooms[currentRoom]) return
        console.log(key)
        if (!rooms[currentRoom].keysToPress.includes(key)) {
            rooms[currentRoom].keysToPress.push(key)
        }
    })
    socket.on('keyup', key => {
        if (!rooms[currentRoom]) return
        if (rooms[currentRoom].keysToPress.includes(key)) {
            rooms[currentRoom].keysToPress = rooms[currentRoom].keysToPress.filter(item => item !== key)
        }
    })

    socket.on('loadRom', rom => {
        rooms[currentRoom].gameboy.loadRom(rom)
    })
    socket.on('pauseResume', () => {
        rooms[currentRoom].gameboy.pauseResume()
    })
    socket.on('reset', () => {
        rooms[currentRoom].gameboy.reset()
    })


    
    setInterval(() => {
        console.log(io.sockets.adapter.rooms)
        //console.log(rooms[currentRoom])
        //console.log(rooms[currentRoom] ? rooms[currentRoom].keysToPress : 'no room')
    }, 1000);
})

module.exports = io