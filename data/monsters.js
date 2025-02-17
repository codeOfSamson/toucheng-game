const kittyImage = new Image()
kittyImage.src = './img/kittySpritesheet.png'

const blobImage = new Image()
blobImage.src = './img/blob.png'

const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle: {
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: './img/draggleSprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Kitty: {
    position:{
        x:780,
        y:100,
    },
    image: {
      src: './img/kittySpritesheet.png'
    },
    frames: {
        max: 8,
        hold: 15
    },
    animate: true,
    isEnemy : true,
    name: 'Kitty',
    attacks: [attacks.Tackle, attacks.Fireball]


} ,
  Blob: {
    position:{
        x:190,
        y:250,
    },
    image: {
      src: './img/blob.png'
    },
    frames: {
        max: 4,
        hold: 15
    },
    animate: true,
    name: 'Blob',
    attacks: [attacks.Tackle, attacks.Fireball]


} ,

}
