const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x:0,
        y:0
    },
    image: battleBackgroundImage
})


const kitty = new Monster(monsters.Kitty)

//remove object and add to monsters

const blob = new Monster(monsters.Blob)
blob.attacks.forEach((attack)=> {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
})

const renderedSprites = [blob, kitty]

let battleAnimationId

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
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
        console.log('k', kitty.health)
        console.log('B', blob.health)
        if (kitty.health <= 0){
            queue.push(()=> {
               kitty.faint()
            })
            queue.push(()=> {
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        gsap.to('#overlappingDiv', {
                            opacity: 0 
                        })
                    }
                })
            })
            return
        }
        const randomAttack = kitty.attacks[Math.floor(Math.random() * kitty.attacks.length)]

        queue.push(()=> {
            kitty.attack({
                attack: randomAttack,
                recipient: blob,
                renderedSprites
             })
        })


        if (blob.health <= 0){
            queue.push(()=> {
               blob.faint()
            })
            return
        }

       
    })
    button.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
        document.querySelector('#attackType').style.color = selectedAttack.color
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