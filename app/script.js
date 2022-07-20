const socket = io()

socket.on('frame', frame => {
    document.getElementById("frame").src = frame;
})

function loadRom() {
    socket.emit('loadRom', document.getElementById("rom").files[0])
}

function pauseResume() {
    socket.emit('pauseResume')
}

function reset() {
    setting()
    socket.emit('reset')
}

function setting() {
    document.querySelector("h3").innerText = `In Room: ${document.getElementById("room").value}`
    document.getElementById("inRoom").style.display = "none"
    document.getElementById("settings").style.display = "inline-block"
}

function room() {
    const data = {
        room: document.getElementById("room").value,
        tickrate: document.getElementById("tickrate").value,
        fps: document.getElementById("fps").value
    }
    socket.emit('room', data)
    document.getElementById("settings").style.display = "none"
    document.getElementById("inRoom").style.display = "inline-block"

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

