const serveboy = require("serverboy")
const { createCanvas } = require('canvas');

class Gameboy {
    constructor(romData, fps = 60, tickrate = 60) {
        this.romData = romData
        this._fps = 1000 / fps
        this._tickrate = 1000 / tickrate
        this.pause = false
        this.gameboy = new serveboy();
    }
    run(frameCallback, tickCallback) {
        const canvas = createCanvas(160, 144)
        const ctx = canvas.getContext("2d");
        
        this.gameboy.loadRom(this.romData);
        
        /*const tickInterval = async () => {
            if (this.pause) return
            const ctx_data = ctx.createImageData(160, 144);

            const data = this.gameboy.doFrame();
            for (let i = 0; i < data.length; i++) {
                ctx_data.data[i] = data[i];
            }

            ctx.putImageData(ctx_data, 0, 0);
            tickCallback(this.gameboy)
            this._tickrate = this._tickrate
            console.log(this._tickrate)
            clearInterval(this.interval)
            this.interval = setInterval(tickInterval, this._tickrate)
        }*/
        
        this.tickFrame = setInterval(async () => {
            if (this.pause) return
            const ctx_data = ctx.createImageData(160, 144);

            const data = this.gameboy.doFrame();
            for (let i = 0; i < data.length; i++) {
                ctx_data.data[i] = data[i];
            }

            ctx.putImageData(ctx_data, 0, 0);
            tickCallback(this.gameboy)
        }, this._tickrate);

        this._fpsFrame = setInterval(async () => {
            frameCallback(canvas.toDataURL())//Buffer.from(canvas.toDataURL().split(",").pop(), "base64"))
        }, this._fps)
        //this.interval = setInterval(tickInterval, this._tickrate)
    }
    stop() {
        clearInterval(this.tickFrame)
        clearInterval(this._fpsFrame)
    }
    pauseResume() {
        this.pause ? this.pause = false : this.pause = true
    }
    reset() {
        this.gameboy.loadRom(this.romData);
    }
    loadRom(romData) {
        this.romData = romData
        this.gameboy.loadRom(romData);
    }
    set tickrate(tickrate) {
        this._tickrate = 1000 / tickrate
        console.log(this._tickrate)
    }
    set fps(fps) {
        this._fps = 1000 / fps
    }
}

module.exports = Gameboy