let commands = []
let selectedColor = 'transparent'
let isPenUp = false

window.forward = number => {
  commands.push(sketch => {
    if (!isPenUp) sketch.line(0, 0, 0, -number)
    sketch.translate(0, -number)
  })
}

window.back = number => {
  forward(-number)
}

window.repeat = (count, callback) => {
  for (window.i = 0; i < count; i++) {
    callback()
  }
}

window.right = (degrees) => {
  commands.push(sketch => {
    sketch.rotate(degrees)
  })
}

window.left = (degrees) => {
  right(-degrees)
}

window.color = (value) => {
  commands.push(sketch => {
    selectedColor = value
    sketch.stroke(value)
  })
}

window.penUp = () => {
  commands.push(sketch => {
    isPenUp = true
  })
}

window.penDown = () => {
  commands.push(sketch => {
    isPenUp = false
  })
}

new p5(sketch => {
  let index = 0

  let play = sketch.createButton('play')
  let stop = sketch.createButton('stop')
  let reset = sketch.createButton('reset')
  sketch.createButton(' ')
  let slow = sketch.createButton('slow')
  let fast = sketch.createButton('fast')
  sketch.createButton(' ')
  let rew = sketch.createButton('rew')
  let ff = sketch.createButton('ff')

  let state = 'play'

  play.mouseClicked(() => state = 'play')
  stop.mouseClicked(() => state = 'stop')
  reset.mouseClicked(() => {
    state = 'stop'
    index = 0
  })
  fast.mouseClicked(() => {
    state = 'play'
    sketch.frameRate(50)
  })
  slow.mouseClicked(() => {
    state = 'play'
    sketch.frameRate(2)
  })
  ff.mouseClicked(() => {
    state = 'once'
    index = sketch.constrain(index, 0, commands.length - 1)
  })
  rew.mouseClicked(() => {
    state = 'once'
    index = index - 2
    index = sketch.constrain(index, 0, commands.length - 1)
  })

  sketch.setup = () => {
    sketch.createCanvas(300, 300)
    sketch.frameRate(10)
    sketch.angleMode(sketch.DEGREES)
    sketch.background('white')
  }

  sketch.draw = () => {
    selectedColor = 'black'
    isPenUp = false
    sketch.noFill()
    sketch.stroke(selectedColor)
    sketch.strokeWeight(2)
    sketch.translate(150, 150)

    if (index > commands.length) return
    if (state === 'stop') {
      if (index === 0) {
        sketch.background('white')
        drawTurtle(sketch)
      }
      return
    } else if (state === 'once') {
      state = 'stop'
    }

    sketch.background('white')

    let queuedCommands = commands.concat().splice(0, index)
    queuedCommands.forEach(command => command(sketch))
    index++

    drawTurtle(sketch)
  }
})

let drawTurtle = (sketch) => {
  sketch.fill(selectedColor)
  sketch.noStroke()
  sketch.triangle(-5, 0, 5, 0, 0, -10)
}
