
kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [4, 156, 216],
})

const MOVE_SPEED = 120
const JUMP_FORCE = 400
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const ENEMY_SPEED = 20

let isJumping = true

loadSprite('coin', 'https://i.ibb.co/dgP4nLk/cake.png')
loadSprite('sky', 'https://i.ibb.co/ZLB1GNM/images.jpg');
loadSprite('evil-shroom', 'https://i.ibb.co/9n7CSB6/choco-cake.png')
loadSprite('brick', 'https://i.imgur.com/pogC9x5.png')
loadSprite('block', 'https://i.imgur.com/M6rwarW.png')
loadSprite('mario', 'https://i.ibb.co/cDXP5SN/mario.png')
loadSprite('mushroom', 'https://i.ibb.co/DfcJDRC/shroom.png')
loadSprite('surprise', 'https://i.imgur.com/gesQ1KP.png')
loadSprite('unboxed', 'https://i.imgur.com/bdrLpi6.png')
loadSprite('pipe-top-left', 'https://i.imgur.com/ReTPiWY.png')
loadSprite('pipe-top-right', 'https://i.imgur.com/hj2GK4n.png')
loadSprite('pipe-bottom-left', 'https://i.imgur.com/c1cYSbt.png')
loadSprite('pipe-bottom-right', 'https://i.imgur.com/nqQ79eI.png')

loadSprite('blue-block', 'https://i.imgur.com/fVscIbn.png')
loadSprite('blue-brick', 'https://i.imgur.com/3e5YRQd.png')
loadSprite('blue-steel', 'https://i.imgur.com/gqVoI2b.png')
loadSprite('blue-evil-shroom', 'https://i.ibb.co/9n7CSB6/choco-cake.png')
loadSprite('blue-surprise', 'https://i.imgur.com/RMqCc1G.png')

scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
  add([
    sprite('sky'),
    layer('bg'),
    scale(width() / 40, height() / 115),
    origin('topleft')
  ]);

  const maps = [
    [
      '=                                                                                                                                                                                                    ',
      '=                                                                                                                                                                                                    ',
      '=                                                                                                                                                                                                    ',
      '=                                                                                                                                                                                                    ',
      '=                                                                                                                                                                                                    ',
      '=                                                                                                                                                                                                    ',
      '=           %                                                         ^ ^                                                                                                        ==                  ',
      '=                                                                     ========   ==%              *           ===    =%%=                                                       ===                  ',
      '=                                                                                                                                                                              ====                  ',
      '=                                                                                                                                                                             =====                  ',
      '=     %   =*=%=                     -+         -+                  =*=             =     ==    %  %  %     =          ==      =  =          ==  =            ==%=            ======                  ',
      '=                           -+      ()         ()                                                                            ==  ==        ===  ==                          =======                  ',
      '=                 -+        ()      ()         ()                                                                           ===  ===      ====  ===     -+              -+ ========     <>           ',
      '=                ^()        ()^     ()   ^ ^   ()                                    ^ ^        ^     ^ ^       ^ ^  ^ ^   ====  ====    =====  ====    ()              ()=========     ()           ',
      '===========================================================  ===============   ===============================================================  ===================================     ==           ',
    ],
    [
      '£                                       £',
      '£     $      $       $                 £',
      '£     =   %* =   %*  =  %*              £',
      '£     =   =   =   =  =   =      x x    £',
      '£                       x x x          £',
      '£        @@@@@@      x x x x  x        £',
      '£                          x x x        £',
      '£    z                     x x  x   -+£',
      '£    z   z  z   z  x x x x x  x   ()£',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    ],
  ]

  const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('block'), 'brick', solid()],
    '$': [sprite('coin'), 'coin'],
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), 'pipe', solid(), scale(0.5)],
    '+': [sprite('pipe-top-right'), 'pipe', solid(), scale(0.5)],
    '^': [sprite('evil-shroom'), 'enemy', solid(), body()],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '£': [sprite('blue-brick'), 'brick', solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'enemy'],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],
    '<': [sprite('pipe-top-left'), solid(), scale(0.5), 'exit-pipe'],
    '>': [sprite('pipe-top-right'), solid(), scale(0.5), 'exit-pipe'],
  }

  const gameLevel = addLevel(maps[level], levelCfg)

  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer('ui'),
    {
      value: score,
    }
  ])

  add([text('level ' + parseInt(level + 1)), pos(40, 6)])

  function big() {
    let isBig = false
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
        }
      },
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(1)
        CURRENT_JUMP_FORCE = JUMP_FORCE
        isBig = false
      },
      biggify() {
        this.scale = vec2(1.5)
        isBig = true
      }
    }
  }

  const player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    big(),
    origin('botleft')
  ])

  action('mushroom', (m) => {
    m.move(20, 0)
  })

  player.on("headbump", (obj) => {
    if (obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0, 0))
    }
    if (obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0, 0))
    }
    if (obj.is('brick') && player.isBig()) {
      destroy(obj)
      player.jump(-100)
      scoreLabel.value += 0.5
    }
  })

  player.collides('mushroom', (m) => {
    destroy(m)
    player.biggify()
  })

  player.collides('coin', (c) => {
    destroy(c)
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
  })

  action('enemy', (d) => {
    d.move(-ENEMY_SPEED, 0)
  })

  player.collides('enemy', (enemy) => {
    if (enemy.pos.y >= player.pos.y) {
      destroy(enemy)
      player.jump(100)
      scoreLabel.value++
      scoreLabel.text = scoreLabel.value
    } else {
      if (player.isBig())
        player.smallify()
      else
        go('lose', { score: scoreLabel.value })
    }
  })

  player.action(() => {
    camPos(player.pos.add(0, -0))
    if (player.pos.y > 1000)
      go('lose', { score: scoreLabel.value })
  })

  player.collides('exit-pipe', () => {
    keyPress('down', () => {
      go('game', {
        level: (level + 1) % maps.length,
        score: scoreLabel.value
      })
    })
  })


  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false
    }
  })

  keyDown('up', () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

});

scene('lose', ({ score }) => {
  add([text('You lost!', 32), origin('center'), pos(width() / 2, height() / 2 - 40)]);
  add([text('Score: ' + score, 24), origin('center'), pos(width() / 2, height() / 2)]);
  add([text('Press R to restart', 16), origin('center'), pos(width() / 2, height() / 2 + 40)]);

  function restart() {
    go('game', { level: 0, score: 0 });
  }

  keyPress('r', () => {
    restart();
  });
});

start("game", { level: 0, score: 0 })
