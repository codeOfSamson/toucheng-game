const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x:0,
        y:0
    },
    image: battleBackgroundImage
})

const kittyImage = new Image()
kittyImage.src = './img/kittySpritesheet.png'

const blobImage = new Image()
blobImage.src = './img/blob.png'

const kitty = new Sprite({
    position:{
        x:780,
        y:100,
    },
    image: kittyImage,
    frames: {
        max: 8,
        hold: 15
    },
    animate: true,
    isEnemy : true,
    name: 'Kitty'

})

//remove object and add to monsters

const blob = new Sprite({
    position:{
        x:190,
        y:250,
    },
    image: blobImage,
    frames: {
        max: 4,
        hold: 15
    },
    animate: true,
    name: 'Blob'


})
//May need to add my characters to mosters.js
//const emby = new Sprite(monsters.Emby)

const renderedSprites = [blob, kitty]

const button = document.createElement('button')
button.innerHTML = 'Fireball'
document.querySelector('#attacksBox').append(button)

function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite)=> {
        sprite.draw()
    })
}
animateBattle()

const queue = []

document.querySelectorAll('button').forEach((button)=> {
    button.addEventListener('click', (e)=>{
        console.log(e.currentTarget.innerHTML)
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        blob.attack({
            attack: selectedAttack,
            recipient: kitty,
            renderedSprites
        })
        queue.push(()=> {
            kitty.attack({
                attack: attacks.Tackle,
                recipient: blob,
                renderedSprites
            })
        })
    })
})

document.querySelector('#dialogueBox').addEventListener('click',(e)=>{
   if( queue.length > 0){
    queue[0]()
    queue.shift()
   } else {
    e.currentTarget.style.display = 'none'

   }
} )