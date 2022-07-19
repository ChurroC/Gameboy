const Gameboy = require("./gameboy");
const fs = require("fs");

const io = require('socket.io')({
    cors: {
        origin: ['https://admin.socket.io']
    }
})

const rom = fs.readFileSync('./Super_Mario_Land.gb')

const rooms = {}
let i = 0

io.on('connection', socket => {
    let currentRoom = socket.id

    socket.on('room', room => {
        socket.leave(currentRoom)
        socket.join(room)
        currentRoom = room
        if (!rooms[room]) {
            console.log(room)
            rooms[room] = {keysToPress: []}
            rooms[room].gameboy = new Gameboy(rom, 60, 250)
            rooms[room].gameboy.run(frame => {
                //console.log(currentRoom)
                frame = {
                    frame: frame,
                    room: room
                }
                io.to(room).emit('frame', frame)
            }, gameboy => {
                rooms[room] ? gameboy.pressKeys(rooms[room].keysToPress) : null//console.log(`${room} is not in the rooms object`)
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
        console.log(socket.rooms)
        console.log(Object.keys(rooms))
        //console.log(`between${i++}`)
        //console.log(io.sockets.adapter.rooms[currentRoom])
        //console.log(rooms[currentRoom] ? rooms[currentRoom].keysToPress : 'no room')
    }, 3500);
})

module.exports = io