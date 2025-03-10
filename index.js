const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70){
    collisionsMap.push(collisions.slice(i, i + 70))
    
}

const battleZoneMap = []
for (let i = 0; i < battleZonesData.length; i += 70){
    battleZoneMap.push(battleZonesData.slice(i, i + 70)) 
}

const boundaries = [] 
const offset = {
    x: -735, 
    y: -650
}


collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025) {
            boundaries.push(
                new Boundary(
                    {position: {
                     x: j * Boundary.width + offset.x,
                     y: i * Boundary.height + offset.y,
            }}))
        }
      
    })
})

const battleZones = []
battleZoneMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025) {
            battleZones.push(
                new Boundary(
                    {position: {
                     x: j * Boundary.width + offset.x,
                     y: i * Boundary.height + offset.y,
            }}))
        }
      
    })
})


const image = new Image()
image.src = './img/Pellet Town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'


const playerDownImage = new Image
playerDownImage.src =   './img/scootDown.png'

const playerUpImage = new Image
playerUpImage.src =   './img/scootDown.png'

const playerLeftImage = new Image
playerLeftImage.src =   './img/2Scoot.png'

const playerRightImage = new Image
playerRightImage.src =   './img/scootDown.png'



const player = new Sprite({
    position: {
        x:canvas.width/2 - 192/4/2, 
        y:canvas.height/2 -68/2,
    },
    image: playerDownImage,
    frames: {
        max: 2,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})


const background = new Sprite ({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite ({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}


const movables = [ background, ...boundaries, foreground, ...battleZones]

function rectangularCollision ({rectangle1, rectangle2}) {
   return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
)
}

const battle = {
    initiated: false
}

function animate () {
   const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary)=>{
        boundary.draw()  
    })
    battleZones.forEach((battleBoundary) => {
        
        battleBoundary.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    console.log(keys.s)

    if (battle.initiated) return
    //activate a battle
    if( keys.w.pressed || keys.a.pressed || keys.s.pressed|| keys.d.pressed){
        for (let i=0; i < battleZones.length; i++ ){
            const battleZone = battleZones[i]
            const overlappingArea =  (Math.min(
                player.position.x + player.width,
                battleZone.position.x + battleZone.width
            ) - Math.max(
                player.position.x,
                battleZone.position.x
            )) *
            (Math.min(
                player.position.y + player.height, 
                battleZone.position.y + battleZone.height
            ) - Math.max(
                player.position.y,
                battleZone.position.y
            ))
             if (
                 rectangularCollision({
                     rectangle1: player,
                     rectangle2: battleZone
                     }) && overlappingArea > (player.width * player.height) / 2
                     && Math.random() < .05

             ){
                window.cancelAnimationFrame(animationId)

                battle.initiated = true
                audio.Map.stop()
                audio.battle.play()
                gsap.to('#overlappingDiv',{
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: .4,
                    onComplete(){
                         gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete(){
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4,
                                 })
                            }
                         })
                      

                    }
                })
                break
             }
         }
    }


    if(keys.w.pressed && lastKey === 'w' ){
        player.animate = true
        player.image = player.sprites.up
        for (let i=0; i < boundaries.length; i++ ){
           const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary. position.y + 3
                        }
                    }
                })
            ){
                moving = false
                break
            }
        }
console.log(moving)
        if (moving)
        movables.forEach(moveable => moveable.position.y += 3)
    }
    else if (keys.a.pressed && lastKey === 'a' ) {
        player.animate = true
        player.image = player.sprites.left
        for (let i=0; i < boundaries.length; i++ ){
            const boundary = boundaries[i]
             if (
                 rectangularCollision({
                     rectangle1: player,
                     rectangle2: {...boundary,
                         position: {
                             x: boundary.position.x + 3,
                             y: boundary. position.y
                         }
                     }
                 })
             ){
                 moving = false
                 break
             }
         }
         if (moving)
        movables.forEach(moveable => moveable.position.x += 3)
    }
    else if (keys.s.pressed && lastKey === 's' ){
        console.log(1)
        player.animate = true
        player.image = player.sprites.down
        for (let i=0; i < boundaries.length; i++ ){
            const boundary = boundaries[i]
             if (
                 rectangularCollision({
                     rectangle1: player,
                     rectangle2: {...boundary,
                         position: {
                             x: boundary.position.x,
                             y: boundary. position.y - 3
                         }
                     }
                 })
             ){
                 moving = false
                 break
             }
         }
         if (moving)
            console.log('made it')
        movables.forEach(moveable => moveable.position.y -= 1)
    }
    else if (keys.d.pressed && lastKey === 'd' ) {
        player.animate = true
        player.image = player.sprites.right
        for (let i=0; i < boundaries.length; i++ ){
            const boundary = boundaries[i]
             if (
                 rectangularCollision({
                     rectangle1: player,
                     rectangle2: {...boundary,
                         position: {
                             x: boundary.position.x -3,
                             y: boundary. position.y 
                         }
                     }
                 })
             ){
                 moving = false
                 break
             }
         }
         if (moving)
        movables.forEach(moveable => moveable.position.x -= 3)
    }
}
//animate()



let lastKey = ''
window.addEventListener('keydown', (e)=>{
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e)=>{
    switch(e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})

let clicked = false
window.addEventListener('click', (e)=> {
    if(!clicked) {
        audio.Map.play()
        clicked = true
        }
})