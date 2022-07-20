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
    let currentRoom = socket.id

    socket.on('room', data => {
        const room = data.room
        socket.leave(currentRoom)
        socket.join(room)
        currentRoom = room
        if (!rooms[room]) {
            rooms[room] = {keysToPress: []}
            rooms[room].gameboy = new Gameboy(rom, data.fps, data.tickrate)
            rooms[room].gameboy.run(frame => {
                io.to(room).emit('frame', frame)
            }, gameboy => {
                rooms[room] ? gameboy.pressKeys(rooms[room].keysToPress) : null
            })
        }
    })

    socket.on('keydown', key => {
        if (!rooms[currentRoom]) return
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

    socket.on('tickrate', tickrate => {
        console.log('tickrate')
        console.log(tickrate)
        rooms[currentRoom].gameboy.tickrate = tickrate
    })
    socket.on('fps', fps => {
        console.log(fps)
        rooms[currentRoom].gameboy.fps = fps
        console.log(rooms[currentRoom].gameboy._fps)
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
})

module.exports = io