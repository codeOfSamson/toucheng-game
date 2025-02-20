const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x:0,
        y:0
    },
    image: battleBackgroundImage
})


let kitty 
let blob 
let queue

let renderedSprites 

let battleAnimationId

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()
    kitty = new Monster(monsters.Kitty)
    blob = new Monster(monsters.Blob)
    renderedSprites = [blob, kitty]
    queue = []


    blob.attacks.forEach((attack)=> {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    document.querySelectorAll('button').forEach((button)=> {
        button.addEventListener('click', (e)=>{
            console.log(e.currentTarget.innerHTML)
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            blob.attack({
                attack: selectedAttack,
                recipient: kitty,
                renderedSprites
            })
      
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
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0 
                            })
                            battle.initiated = false 
                            audio.Map.play()

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
                queue.push(()=> {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0 
                            })
                           battle.initiated = false 
                           audio.Map.play()
                        }
                    })
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
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite)=> {
        sprite.draw()
    })
}
animate()
//  initBattle()
// animateBattle()




document.querySelector('#dialogueBox').addEventListener('click',(e)=>{
   if( queue.length > 0){
    queue[0]()
    queue.shift()
   } else {
    e.currentTarget.style.display = 'none'

   }
} )