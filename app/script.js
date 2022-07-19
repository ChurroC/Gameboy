const socket = io()

socket.on('frame', frame => {
    document.getElementById("frame").src = frame.frame;
    console.log(frame.room)
})

function loadRom() {
    socket.emit('loadRom', document.getElementById("rom").files[0])
}

function pauseResume() {
    socket.emit('pauseResume')
}

function reset() {
    socket.emit('reset')
}

socket.on('hu', frame => {
    //console.log(frame)
})

function room() {
    const room = document.getElementById("room").value
    socket.emit('room', room)
    document.querySelector("h3").innerText = `In Room: ${room}`
    document.getElementById("inRoom").style.display = "block"

    document.addEventListener('keydown', key => {
        const keyMap = {
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "ArrowUp": "up",
            "ArrowDown": "down",
            "a": "a",
            "b": "b",
            "Enter": "start",
            " ": "select"
        }
    
        if (keyMap[key.key] !== undefined) {
            socket.emit('keydown', keyMap[key.key]);
        }
    })
    
    document.addEventListener('keyup', key => {
        const keyMap = {
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "ArrowUp": "up",
            "ArrowDown": "down",
            "a": "a",
            "b": "b",
            "Enter": "start",
            " ": "select"
        }
    
        if (keyMap[key.key] !== undefined) {
            socket.emit('keyup', keyMap[key.key]);
        }
    })
}

