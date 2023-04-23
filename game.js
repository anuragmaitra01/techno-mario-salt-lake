kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [4, 156, 216],
});

const MOVE_SPEED = 120
const JUMP_FORCE = 400
const BIG_JUMP_FORCE = 450
let CURRENT_JUMP_FORCE = JUMP_FORCE
const ENEMY_SPEED = -20

let isJumping = true

loadSprite('mario', 'https://i.ibb.co/cDXP5SN/mario.png');
loadSprite('mario2', 'https://i.ibb.co/n7z6p7Q/New-Piskel-1.png');
loadSprite('mario3', 'https://i.ibb.co/YN9ZtS0/New-Piskel.png');

loadSprite('coin', 'https://i.ibb.co/N6QvzhB/marksheet.png')
loadSprite('sky', 'https://i.ibb.co/ZLB1GNM/images.jpg');
loadSprite('evil-shroom', 'https://i.ibb.co/dBtZkyF/corona-virus-sprite.png')
loadSprite('brick', 'https://i.imgur.com/pogC9x5.png')
loadSprite('block', 'https://i.imgur.com/M6rwarW.png')

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
loadSprite('blue-evil-shroom', 'https://i.ibb.co/DtcRdfx/mobile-sprite.png')
loadSprite('blue-surprise', 'https://i.imgur.com/RMqCc1G.png')

scene('startScreen', () => {
  add([
    text('Welcome to "Super Student Bros: The Corona Years"', 13),
    origin('center'),
    pos(width() / 2, height() / 2 - 140),
    color(1, 0, 0)
  ]);

  const textLines = [
    'A browser-based game that is a hilarious parody on the life of a student in Techno Main Salt Lake.',
    'In this game, you\'ll take control of your favorite student character ',
    'and navigate through the challenges of remote learning during the pandemic.',
    '',
    'Instead of the usual Goombas, you\'ll be battling the dreaded Corona Virus Goombas that are out to get you.',
    'And instead of collecting coins, you\'ll be collecting those pesky worksheets that your teachers keep assigning.',
    'But fear not, dear student, for there are hidden easter eggs ',
    'in the form of mushrooms that will help you on your journey.',
    '',
    'These mushrooms will give you the much-needed energy to keep going,',
    'just like how your favorite energy drink helps you survive your never-ending classes.',
    'As you progress through the game, you\'ll encounter obstacles such as unstable Wi-Fi connections,',
    'annoying classmates who won\'t stop messaging you on WhatsApp,',
    'and those dreaded online quizzes that never seem to end. But don\'t worry, we know you can conquer them all!',
    '',
    'So put on your gaming hat and get ready to experience the life',
    'of a Techno Main Salt Lake student like never before.',
    'Remember, the key to success in this game is to be as sarcastic and funny as possible,',
    'just like your favorite memes that keep you going through those boring lectures.',
    'Let the fun begin!'
  ];

  textLines.forEach((line, index) => {
    add([
      text(line, 6),
      origin('center'),
      pos(width() / 2, height() / 2 - 100 + (index * 10)),
      color(0.678, 0.847, 0.902)
    ]);
  });

  add([
    text('Press Enter to select a character', 16),
    origin('center'),
    pos(width() / 2, height() / 2 + 120),
    color(0, 1, 0)
  ]);

  keyPress('enter', () => {
    go('characterSelect');
  });
});

scene('characterSelect', () => {
  const marioOptions = ['mario', 'mario2', 'mario3'];
  let selectedIndex = 0;

  const sprites = marioOptions.map((mario, i) => {
    return add([sprite(mario), pos(width() / 2 - 50 + i * 50, height() / 2), origin('center')]);
  });

  function updateSprites() {
    sprites.forEach((s, i) => {
      if (i === selectedIndex) {
        s.color = rgba(1, 1, 1, 1);
      } else {
        s.color = rgba(0.5, 0.5, 0.5, 1);
      }
    });
  }

  function resetSprites() {
    sprites.forEach((s) => {
      destroy(s);
    });
  }

  updateSprites();

  add([
    text('Press left or right arrow to select a character', 8),
    origin('center'),
    pos(width() / 2, height() / 2 + 40)
  ]);
  add([
    text('Press Enter to start the game', 8),
    origin('center'),
    pos(width() / 2, height() / 2 + 55)
  ]);
  keyPress('left', () => {
    selectedIndex = (selectedIndex - 1 + marioOptions.length) % marioOptions.length;
    updateSprites();
  });

  keyPress('right', () => {
    selectedIndex = (selectedIndex + 1) % marioOptions.length;
    updateSprites();
  });

  keyPress('enter', () => {
    go('game', { level: 0, score: 0, selectedMario: marioOptions[selectedIndex] });
  });
});


scene("game", ({ level, score, selectedMario }) => {
  layers(['bg', 'obj', 'ui'], 'obj')
  add([
    sprite('sky'),
    layer('bg'),
    scale(width() / 40, height() / 115),
    origin('topleft')
  ]);

  const maps = [
    [
      '_                                                                                                                                                                                                     ',
      '_                                                                                                                                                                                                     ',
      '_                                                                                                                                                                                                     ',
      '_                                                                                                                                                                                                     ',
      '_                                                                                                                                                                                                     ',
      '_                                                                                                                                                                                                     ',
      '_           %                                                         ^ ^                                                                                                         __                  ',
      '_                                                                     =======    ==%              *           ===    =%%=                                                        ___                  ',
      '_                                                                                                                                                                               ____                  ',
      '_                                                                                                                                                                              _____                  ',
      '_     %   =*=%=                     -+         -+                  =*=             =     ==    %  %  %     =          ==      _  _          __   _            ==%=            ______                  ',
      '_                           -+      ()         ()                                                                            __  __        ___   __                          _______                  ',
      '_                 -+        ()      ()         ()                                                                           ___  ___      ____   ___     -+              -+ ________      <>          ',
      '_                ^()        ()^     ()   ^ ^   ()                                    ^ ^        ^     ^ ^       ^ ^  ^ ^   ____  ____    _____   ____    ()              ()_________      ()          ',
      '__________________________________________________________   ______________    _______________________________________________________________   ___________________________________      __          ',
      '000000000000000000000000000000000000000000000000000000000_   _000000000000_    _0000000000000000000000000000000000000000000000000000000000000_   _000000000000000000000000000000000_      __          ',
    ],
    [
      '!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~&~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                         ~~~~~~~',
      '!                                                                   ~~  ~~~~~~  ~~~~       ~~~~                                                                                          ~',
      '!                                                                   ~~  ~~~~~~  ~~~~                                                                                                     ~',
      '!                                                     $$$$        ~~        ~~   ~     ~~         $$$$$$                                                                   xxx           ~',
      '!                                                                 ~~        ~~   ~     ~~         ~~~~~~                                                     xxx                         ~',
      '!                                                  ~  ~~~~  &     ~~    $$$$~~   ~$ &  ~@         ~~~~~~                                                                               <>~',
      '!         &@@@@         x  x           @           ~ $~  ~ $~     ~~~~  ~~~~~~   ~~~~  ~~  ~~~~                            -+                           xx         ~~~~@               ()~',
      '!                       x  x  x     x     x        ~~~~  ~~~~       ~~                                               -+    ()           ~~             xxx                       ~~~~~~~~~',
      '!-+                     x  x  x  x  x     x  x                                                                       ()    ()    -+     ~~            xxxx                       ~~~~~~~~~',
      '!()                z x  x  x  x  x  x  z  x  x           z z             z  z z                                 z z z()    ()  z ()     ~~          zxxxxx          z            ~~~~~~~~~',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   !!   !!!!!!!!!!!!!   xxx   !!!!!   xxx   !!!!!!!!!',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   !!   !!!!!!!!!!!!!         !!!!!         !!!!!!!!!',
    ],
  ]

  const levelCfg = {
    width: 20,
    height: 20,
    '_': [sprite('block'), solid()],
    '=': [sprite('brick'), 'brick', solid()],
    '0': [sprite('block')],
    '$': [sprite('coin'), 'coin', scale(0.5)],
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), 'pipe', solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), 'pipe', solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), 'pipe', solid(), scale(0.5)],
    '+': [sprite('pipe-top-right'), 'pipe', solid(), scale(0.5)],
    '^': [sprite('evil-shroom'), 'enemy', solid(), body(), { speed: ENEMY_SPEED },],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    '<': [sprite('pipe-top-left'), solid(), scale(0.5), 'exit-pipe'],
    '>': [sprite('pipe-top-right'), solid(), scale(0.5), 'exit-pipe'],

    '!': [sprite('blue-block'), solid(), scale(0.5)],
    '~': [sprite('blue-brick'), 'brick', solid(), scale(0.5)],
    'z': [sprite('blue-evil-shroom'), 'enemy', solid(), body(), { speed: ENEMY_SPEED },],
    '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
    '&': [sprite('blue-surprise'), solid(), scale(0.5), 'mushroom-surprise'],
    'x': [sprite('blue-steel'), solid(), scale(0.5)],

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
        this.scale = vec2(0.5)
        CURRENT_JUMP_FORCE = JUMP_FORCE
        isBig = false
      },
      biggify() {
        this.scale = vec2(0.75)
        isBig = true
      }
    }
  }

  const player = add([
    sprite(selectedMario), solid(),
    pos(30, 150),
    body(),
    big(),
    scale(0.5)
    // origin('botleft')
  ]);

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

  action('enemy', (enemy) => {
    if (Math.abs(player.pos.x - enemy.pos.x) <= 500) {
      enemy.move(enemy.speed, 0)
      // enemy.collides('pipe', (pipe) => {
      //   enemy.speed *= -1
      // })
      // enemy.collides('enemy', () => {
      //   enemy.speed *= -1
      // })
    }
    if (enemy.pos.y > 350)
      destroy(enemy)
  })


  player.collides('enemy', (enemy) => {
    if (enemy.pos.y > player.pos.y + 15) {
      destroy(enemy)
      player.jump(150)
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
        score: scoreLabel.value,
        selectedMario: selectedMario
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
    go('characterSelect');
  }

  keyPress('r', () => {
    restart();
  });
});

start("startScreen");
