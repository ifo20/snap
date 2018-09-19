'use strict';
//// CONFIG
var config = {
  numberOfCards: 52,
  playerNames: [ 'Ashley','Dracula']
};
//// END CONFIG

//// HELPERS
function printMessage (text) {
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease
  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text
  $message.style.opacity = 0.5

  document.body.appendChild($message)

  $message.style[transform] = translate('0px', 0)

  animationFrames(1, 2000)
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style.opacity = t;
      $message.style[transform] = translate('0px', (50 * t) + 'px')
    })
    .end(function () {
      animationFrames(1000, 2000)
      .progress(function (t) {
        t = ease.cubicInOut(t)
        $message.style.opacity = 1 - t;
        $message.style[transform] = translate('0px', (50 * (1 + t)) + 'px')
      })
      .end(function () {
        document.body.removeChild($message)
      })
    })


 
}
function createElement(type) {
  return document.createElement(type);
}
function addListener(target, name, listener) {
  target.addEventListener(name, listener);
}
function removeListener(target, name, listener) {
  target.removeEventListener(name, listener);
}
var ease = {
  linear: function linear(t) {
    return t;
  },
  quadIn: function quadIn(t) {
    return t * t;
  },
  quadOut: function quadOut(t) {
    return t * (2 - t);
  },
  quadInOut: function quadInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  cubicIn: function cubicIn(t) {
    return t * t * t;
  },
  cubicOut: function cubicOut(t) {
    return --t * t * t + 1;
  },
  cubicInOut: function cubicInOut(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  quartIn: function quartIn(t) {
    return t * t * t * t;
  },
  quartOut: function quartOut(t) {
    return 1 - --t * t * t * t;
  },
  quartInOut: function quartInOut(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  quintIn: function quintIn(t) {
    return t * t * t * t * t;
  },
  quintOut: function quintOut(t) {
    return 1 + --t * t * t * t * t;
  },
  quintInOut: function quintInOut(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};
function plusminus(value) {
  var plusminus = Math.round(Math.random()) ? -1 : 1;

  return plusminus * value;
}
function fisherYates(array) {
  var rnd, temp;

  for (var i = array.length - 1; i; i--) {
    rnd = Math.random() * i | 0;
    temp = array[i];
    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}
function deg2rad(degrees) {
  return degrees * Math.PI / 180;
}
var memoized = {};
var style = document.createElement('p').style;
function prefix(param) {
  if (typeof memoized[param] !== 'undefined') {
    return memoized[param];
  }

  if (typeof style[param] !== 'undefined') {
    memoized[param] = param;
    return param;
  }

  var camelCase = param[0].toUpperCase() + param.slice(1);
  var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
  var test;

  for (var i = 0, len = prefixes.length; i < len; i++) {
    test = prefixes[i] + camelCase;
    if (typeof style[test] !== 'undefined') {
      memoized[param] = test;
      return test;
    }
  }
}
var transform = prefix('transform');
var has3d;
function translate(a, b, c) {
  typeof has3d !== 'undefined' || (has3d = check3d());

  c = c || 0;

  if (has3d) {
    return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
  } else {
    return 'translate(' + a + ', ' + b + ')';
  }
}
function check3d() {
  // I admit, this line is stealed from the great Velocity.js!
  // http://julian.com/research/velocity/
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (!isMobile) {
    return false;
  }

  var $p = document.createElement('p');

  document.body.appendChild($p);
  $p.style[transform] = 'translate3d(1px,1px,1px)';

  has3d = $p.style[transform];
  has3d = has3d != null && has3d.length && has3d !== 'none';

  document.body.removeChild($p);

  return has3d;
}
var ticking;
var animations = [];
function animationFrames(delay, duration) {
  var now = Date.now();

  // calculate animation start/end times
  var start = now + delay;
  var end = start + duration;

  var animation = {
    start: start,
    end: end
  };

  // add animation
  animations.push(animation);

  if (!ticking) {
    // start ticking
    ticking = true;
    requestAnimationFrame(tick);
  }
  var self = {
    start: function start(cb) {
      // add start callback (just one)
      animation.startcb = cb;
      return self;
    },
    progress: function progress(cb) {
      // add progress callback (just one)
      animation.progresscb = cb;
      return self;
    },
    end: function end(cb) {
      // add end callback (just one)
      animation.endcb = cb;
      return self;
    }
  };
  return self;
}
function tick() {
  var now = Date.now();

  if (!animations.length) {
    // stop ticking
    ticking = false;
    return;
  }

  for (var i = 0, animation; i < animations.length; i++) {
    animation = animations[i];
    if (now < animation.start) {
      // animation not yet started..
      continue;
    }
    if (!animation.started) {
      // animation starts
      animation.started = true;
      animation.startcb && animation.startcb();
    }
    // animation progress
    var t = (now - animation.start) / (animation.end - animation.start);
    animation.progresscb && animation.progresscb(t < 1 ? t : 1);
    if (now > animation.end) {
      // animation ended
      animation.endcb && animation.endcb();
      animations.splice(i--, 1);
      continue;
    }
  }
  requestAnimationFrame(tick);
}
function observable(target) {
  target || (target = {});
  var listeners = {};

  target.on = on;
  target.one = one;
  target.off = off;
  target.trigger = trigger;

  return target;

  function on(name, cb, ctx) {
    listeners[name] || (listeners[name] = []);
    listeners[name].push({ cb: cb, ctx: ctx });
  }

  function one(name, cb, ctx) {
    listeners[name] || (listeners[name] = []);
    listeners[name].push({
      cb: cb, ctx: ctx, once: true
    });
  }

  function trigger(name) {
    var self = this;
    var args = Array.prototype.slice(arguments, 1);

    var currentListeners = listeners[name] || [];

    currentListeners.filter(function (listener) {
      listener.cb.apply(self, args);

      return !listener.once;
    });
  }

  function off(name, cb) {
    if (!name) {
      listeners = {};
      return;
    }

    if (!cb) {
      listeners[name] = [];
      return;
    }

    listeners[name] = listeners[name].filter(function (listener) {
      return listener.cb !== cb;
    });
  }
}
function queue(target) {
  var array = Array.prototype;

  var queueing = [];

  target.queue = queue;
  target.queued = queued;

  return target;

  function queued(action) {
    return function () {
      var self = this;
      var args = arguments;

      queue(function (next) {
        action.apply(self, array.concat.apply(next, args));
      });
    };
  }

  function queue(action) {
    if (!action) {
      return;
    }

    queueing.push(action);

    if (queueing.length === 1) {
      next();
    }
  }
  function next() {
    queueing[0](function (err) {
      if (err) {
        throw err;
      }

      queueing = queueing.slice(1);

      if (queueing.length) {
        next();
      }
    });
  }
}
//// END HELPERS

//// DECK
var Deck = (function () {
  // fallback
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });

  function _card(i) {
    var transform = prefix('transform');

    // calculate rank/suit, etc..
    var rank = i % 13 + 1;
    var suit = (i % 52) / 13 | 0;
    var z = (config.numberOfCards - i)/4;

    // create elements
    var $el = createElement('div');
    var $face = createElement('div');
    var $back = createElement('div');

    // states
    var isDraggable = false;
    var isFlippable = false;
    
    // self = card
    var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };

    var modules = Deck.modules;
    var module;

    // add classes
    $face.classList.add('face');
    $back.classList.add('back');

    // add default transform
    $el.style[transform] = translate(-z + 'px', -z + 'px');

    // add default values
    self.x = -z;
    self.y = -z;
    self.z = z;
    self.rot = 0;

    // set default side to back
    self.setSide('back');

    // add drag/click listeners
    addListener($el, 'mousedown', onMousedown);
    addListener($el, 'touchstart', onMousedown);

    // load modules
    for (module in modules) {
      addModule(modules[module]);
    }

    self.animateTo = function (params) {
      console.log('animateTo (deck)');
      var delay = params.delay;
      var duration = params.duration;
      var _params$x = params.x;
      var x = _params$x === undefined ? self.x : _params$x;
      var _params$y = params.y;
      var y = _params$y === undefined ? self.y : _params$y;
      var _params$z = params.z;
      var z = _params$z === undefined ? self.z : _params$z;
      var _params$rot = params.rot;
      var rot = _params$rot === undefined ? self.rot : _params$rot;
      var ease$$ = params.ease;
      var onStart = params.onStart;
      var onProgress = params.onProgress;
      var onComplete = params.onComplete;
      self.z = z;
      var startX, startY, startRot;
      var diffX, diffY, diffRot;


      animationFrames(delay, duration).start(function () {
        $el.style.zIndex = z;
        startX = self.x || 0;
        startY = self.y || 0;
        startRot = self.rot || 0;
        onStart && onStart();
      }).progress(function (t) {
        var et = ease[ease$$ || 'cubicInOut'](t);

        diffX = x - startX;
        diffY = y - startY;
        diffRot = rot - startRot;

        onProgress && onProgress(t, et);

        self.x = startX + diffX * et;
        self.y = startY + diffY * et;
        self.rot = startRot + diffRot * et;

        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
      }).end(function () {
        onComplete && onComplete();
      });
    };

    // set rank & suit
    self.setRankSuit = function (rank, suit) {
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
    };

    self.setRankSuit(rank, suit);

    self.enableDragging = function () {
      // this activates dragging
      if (isDraggable) {
        // already is draggable, do nothing
        return;
      }
      isDraggable = true;
      $el.style.cursor = 'move';
    };

    self.enableFlipping = function () {
      if (isFlippable) {
        // already is flippable, do nothing
        return;
      }
      isFlippable = true;
    };

    self.disableFlipping = function () {
      if (!isFlippable) {
        // already disabled flipping, do nothing
        return;
      }
      isFlippable = false;
    };

    self.disableDragging = function () {
      if (!isDraggable) {
        // already disabled dragging, do nothing
        return;
      }
      isDraggable = false;
      $el.style.cursor = '';
    };
    return self;

    function addModule(module) {
      // add card module
      module.card && module.card(self);
    }

    function onMousedown(e) {
      var startPos = {};
      var pos = {};
      var starttime = Date.now();

      e.preventDefault();

      // get start coordinates and start listening window events
      if (e.type === 'mousedown') {
        startPos.x = pos.x = e.clientX;
        startPos.y = pos.y = e.clientY;
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        startPos.x = pos.x = e.touches[0].clientX;
        startPos.y = pos.y = e.touches[0].clientY;
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }

      if (!isDraggable) {
        // is not draggable, do nothing
        return;
      }

      // move card
      $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      $el.style.zIndex = maxZ++;

      function onMousemove(e) {
        if (!isDraggable) {
          // is not draggable, do nothing
          return;
        }
        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }

        // move card
        $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      }

      function onMouseup(e) {
        if (isFlippable && Date.now() - starttime < 200) {
          // flip sides
          self.setSide(self.side === 'front' ? 'back' : 'front');
        }
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }
        if (!isDraggable) {
          // is not draggable, do nothing
          return;
        }

        // set current position
        self.x = self.x + pos.x - startPos.x;
        self.y = self.y + pos.y - startPos.y;
      }
    }

    function mount(target) {
      // mount card to target (deck)
      target.appendChild($el);

      self.$root = target;
    }

    function unmount() {
      // unmount from root (deck)
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }

    function setSide(newSide) {
      // flip sides
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
        $el.appendChild($face);
        self.setRankSuit(self.rank, self.suit);
      } else {
        if (self.side === 'front') {
          $el.removeChild($face);
        }
        self.side = 'back';
        $el.appendChild($back);
        $el.setAttribute('class', 'card');
      }
    }
  }

  function SuitName(suit) {
    // return suit name from suit value
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }

  var flip = {
    deck: function deck(_deck) {
      _deck.flip = _deck.queued(flip);

      function flip(next, side) {
        var flipped = _deck.cards.filter(function (card) {
          return card.side === 'front';
        }).length / _deck.cards.length;

        _deck.cards.forEach(function (card, i) {
          card.setSide(side ? side : flipped > 0.5 ? 'back' : 'front');
        });
        next();
      }
    }
  };

  var sort = {
    deck: function deck(_deck2) {
      _deck2.sort = _deck2.queued(sort);

      function sort(next, reverse) {
        var cards = _deck2.cards;

        cards.sort(function (a, b) {
          if (reverse) {
            return a.i - b.i;
          } else {
            return b.i - a.i;
          }
        });

        cards.forEach(function (card, i) {
          card.sort(i, cards.length, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          }, reverse);
        });
      }
    },
    card: function card(_card2) {
      var $el = _card2.$el;

      _card2.sort = function (i, len, cb, reverse) {
        var z = i / 4;
        var delay = i * 10;

        _card2.animateTo({
          delay: delay,
          duration: 400,

          x: -z,
          y: -150,
          rot: 0,

          onComplete: function onComplete() {
            $el.style.zIndex = i;
          }
        });

        _card2.animateTo({
          delay: delay + 500,
          duration: 400,

          x: -z,
          y: -z,
          rot: 0,

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function fontSize() {
    return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
  }

  var ____fontSize;

  var shuffle = {
    deck: function deck(_deck3) {
      _deck3.shuffle = _deck3.queued(shuffle);

      function shuffle(next) {
        var cards = _deck3.cards;
        ____fontSize = fontSize();

        fisherYates(cards);

        cards.forEach(function (card, i) {
          card.pos = i;

          card.shuffle(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
        return;
      }
    },

    card: function card(_card3) {
      var $el = _card3.$el;

      _card3.shuffle = function (cb) {
        var i = _card3.pos;
        var z = i / 4;
        var delay = i * 2;
        console.log('deckshufflecard');
        _card3.animateTo({
          delay: delay,
          duration: 100,

          x: _card3.x + (plusminus(Math.random() * 40 + 20) * ____fontSize / 16),
          y: _card3.y - z,
          rot: 0
        });
        _card3.animateTo({
          delay: 100 + delay,
          duration: 100,

          x: -z,
          y: -z,
          rot: 0,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var __fontSize;

  var poker = {
    deck: function deck(_deck4) {
      _deck4.poker = _deck4.queued(poker);

      function poker(next) {
        var cards = _deck4.cards;
        var len = cards.length;

        __fontSize = fontSize();

        cards.slice(-5).reverse().forEach(function (card, i) {
          card.poker(i, len, function (i) {
            card.setSide('front');
            if (i === 4) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card4) {
      var $el = _card4.$el;

      _card4.poker = function (i, len, cb) {
        var delay = i * 250;

        _card4.animateTo({
          delay: delay,
          duration: 250,

          x: Math.round((i - 2.05) * 70 * __fontSize / 16),
          y: Math.round(-110 * __fontSize / 16),
          rot: 0,

          onStart: function onStart() {
            $el.style.zIndex = len - 1 + i;
          },
          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var intro = {
    deck: function deck(_deck5) {
      _deck5.intro = _deck5.queued(intro);

      function intro(next) {
        var cards = _deck5.cards;

        cards.forEach(function (card, i) {
          card.setSide('front');
          card.intro(i, function (i) {
            animationFrames(250, 0).start(function () {
              card.setSide('back');
            });
            if (i === cards.length - 1) {
              console.log(next);
              next();
            }
          });
        });
      }
    },
    card: function card(_card5) {
      var transform = prefix('transform');

      var $el = _card5.$el;

      _card5.intro = function (i, cb) {
        var delay = 500 + i * 10;
        var z = i / 4;

        $el.style[transform] = translate(-z + 'px', '-250px');

        _card5.x = -z;
        _card5.y = -250 - z;
        _card5.rot = 0;

        _card5.animateTo({
          delay: delay,
          duration: 1000,

          x: -z,
          y: -z,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },
          onProgress: function onProgress(t) {
            $el.style.opacity = t;
          },
          onComplete: function onComplete() {
            $el.style.opacity = '';
            cb && cb(i);
          }
        });
      };
    }
  };

  var _fontSize;

  var fan = {
    deck: function deck(_deck6) {
      _deck6.fan = _deck6.queued(fan);

      function fan(next) {
        var cards = _deck6.cards;
        var len = cards.length;

        _fontSize = fontSize();

        cards.forEach(function (card, i) {
          card.fan(i, len, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card6) {
      var $el = _card6.$el;

      _card6.fan = function (i, len, cb) {
        var z = i / 4;
        var delay = i * 10;
        var rot = i / (len - 1) * 260 - 130;

        _card6.animateTo({
          delay: delay,
          duration: 300,

          x: -z,
          y: -z,
          rot: 0
        });
        _card6.animateTo({
          delay: 300 + delay,
          duration: 300,

          x: Math.cos(deg2rad(rot - 90)) * 55 * _fontSize / 16,
          y: Math.sin(deg2rad(rot - 90)) * 55 * _fontSize / 16,
          rot: rot,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var ___fontSize;

  var play = {
    card: function card(_card9) {
      _card9.play = function (cb) {
        _card9.animateTo({
          delay: 0,
          duration: 400,
          x: 0,
          y: 0,
          rot: 0,

          onComplete: function onComplete(){
            cb(_card9.i);
          }
        });
      };
    }
  }
  
  var bysuit = {
    deck: function deck(_deck7) {
      _deck7.bysuit = _deck7.queued(bysuit);
      function bysuit(next) {
        var cards = _deck7.cards;

        ___fontSize = fontSize();

        cards.forEach(function (card) {
          card.bysuit(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card7) {
      var rank = _card7.rank;
      var suit = _card7.suit;

      _card7.bysuit = function (cb) {
        var i = _card7.i;
        var delay = i * 10;

        _card7.animateTo({
          delay: delay,
          duration: 400,

          x: -Math.round((6.75 - rank) * 8 * ___fontSize / 16),
          y: -Math.round((1.5 - suit) * 92 * ___fontSize / 16),
          rot: Math.random()*30,

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function Deck(jokers) {
    // init cards array
    var cards = new Array(config.numberOfCards);
    
    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
    var $root;

    var modules = Deck.modules;
    var module;

    // make queueable
    queue(self);

    // load modules
    for (module in modules) {
      addModule(modules[module]);
    }

    // add class
    $el.classList.add('deck');

    var card;

    // create cards
    for (var i = cards.length; i; i--) {
      card = cards[i - 1] = _card(i - 1);
      card.setSide('back');
      card.mount($el);
    }

    // Define deal function
    function deal(players,cards=999999){
      console.log('dealing');
      var n = players.length;
      var cardsDealtPerPlayer = 0;
      while (cardsDealtPerPlayer < cards){
        // Deal card to every player
        players.forEach(function(player){
          if (self.cards.length > 0) {
            console.log('dealing card to player ' + player.name);
            var nc = self.cards.pop();
            console.log('dealing the following card');
            console.log(nc);
            var x = player.hand.rootx - player.hand.cards.length/4;
            var y = player.hand.rooty - player.hand.cards.length/4;
            var z = player.hand.cards.length;
            console.log('z will be ' + z);
            console.log('x will be ' + x);
            console.log('y will be ' + y);
            player.hand.cards.push(nc);
            nc.animateTo({
              delay: 0,
              duration: 999,
              x: player.hand.rootx - player.hand.cards.length/4,
              y: player.hand.rooty - player.hand.cards.length/4,
              z: z
            });
          }
          else {
            return -1;
          }
        });
        cardsDealtPerPlayer += 1;
      }
    };
    self.deal = deal;

    // // Define translate function
    // function animateTo(params){
    //   self.cards.forEach(function(c){
    //     c.animateTo(params);
    //   })
    // };
    // self.animateTo = animateTo;
    
    return self;

    function mount(root) {
      // mount deck to root
      $root = root;
      $root.appendChild($el);
    }

    function unmount() {
      // unmount deck from root
      $root.removeChild($el);
    }

    function addModule(module) {
      module.deck && module.deck(self);
    }
  }
  Deck.animationFrames = animationFrames;
  Deck.ease = ease;
  Deck.modules = { 
    bysuit: bysuit, 
    fan: fan, 
    play: play, 
    intro: intro, 
    poker: poker, 
    shuffle: shuffle, 
    sort: sort, 
    flip: flip
  };
  Deck.Card = _card;
  Deck.prefix = prefix;
  Deck.translate = translate;
  return Deck;
})();
//// END DECK

//// HAND
var Hand = (function () {
  // fallback
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });

  function _card(i) {
    // calculate rank/suit, etc..
    var rank = i % 13 + 1;
    var suit = i / 13 | 0;
    var z = 1000 - i;

    // create elements
    var $el = createElement('div');
    var $face = createElement('div');
    var $back = createElement('div');

    // states
    var isDraggable = false;
    var isFlippable = false;
    
    // self = card
    var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };

    var modules = Deck.modules;
    var module;

    // add classes
    $face.classList.add('face');
    $back.classList.add('back');

    // add default transform
    $el.style[transform] = translate(-z + 'px', -z + 'px');

    // add default values
    self.x = self.rootx;
    self.y = self.rooty;
    self.z = z;
    self.rot = 0;

    // set default side to back
    self.setSide('back');

    // add drag/click listeners
    addListener($el, 'mousedown', onMousedown);
    addListener($el, 'touchstart', onMousedown);

    // load modules
    for (module in modules) {
      addModule(modules[module]);
    }

    self.animateTo = function (params) {
      console.log('animate to (hand)');
      var delay = params.delay;
      var duration = params.duration;
      var _params$x = params.x;
      var x = _params$x === undefined ? self.x : _params$x;
      var _params$y = params.y;
      var y = _params$y === undefined ? self.y : _params$y;
      var _params$z = params.z;
      var z = _params$z === undefined ? self.z : _params$z;
      var _params$rot = params.rot;
      var rot = _params$rot === undefined ? self.rot : _params$rot;
      var ease$$ = params.ease;
      var onStart = params.onStart;
      var onProgress = params.onProgress;
      var onComplete = params.onComplete;

      var startX, startY, startRot;
      var diffX, diffY, diffRot;

      self.style.zIndex = z;

      animationFrames(delay, duration).start(function () {
        console.log('aniframesstart');
        startX = self.x || 0;
        startY = self.y || 0;
        startZ = self.z || 0;
        startRot = self.rot || 0;
        onStart && onStart();
      }).progress(function (t) {
        var et = ease[ease$$ || 'cubicInOut'](t);
        diffX = x - startX;
        diffY = y - startY;
        diffZ = z - startZ;
        diffRot = rot - startRot;

        onProgress && onProgress(t, et);

        self.x = startX + diffX * et;
        self.y = startY + diffY * et;
        self.z = startZ + diffZ * et;
        self.rot = startRot + diffRot * et;

        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
      }).end(function () {
        onComplete && onComplete();
      });
    };

    // set rank & suit
    self.setRankSuit = function (rank, suit) {
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
    };

    self.setRankSuit(rank, suit);

    self.enableDragging = function () {
      // this activates dragging
      if (isDraggable) {
        // already is draggable, do nothing
        return;
      }
      isDraggable = true;
      $el.style.cursor = 'move';
    };

    self.enableFlipping = function () {
      if (isFlippable) {
        // already is flippable, do nothing
        return;
      }
      isFlippable = true;
    };

    self.disableFlipping = function () {
      if (!isFlippable) {
        // already disabled flipping, do nothing
        return;
      }
      isFlippable = false;
    };

    self.disableDragging = function () {
      if (!isDraggable) {
        // already disabled dragging, do nothing
        return;
      }
      isDraggable = false;
      $el.style.cursor = '';
    };
    self.rootx = 0;
    self.rooty = 0;
    return self;

    function addModule(module) {
      // add card module
      module.card && module.card(self);
    }

    function onMousedown(e) {
      var startPos = {};
      var pos = {};
      var starttime = Date.now();

      e.preventDefault();

      // get start coordinates and start listening window events
      if (e.type === 'mousedown') {
        startPos.x = pos.x = e.clientX;
        startPos.y = pos.y = e.clientY;
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        startPos.x = pos.x = e.touches[0].clientX;
        startPos.y = pos.y = e.touches[0].clientY;
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }

      if (!isDraggable) {
        // is not draggable, do nothing
        return;
      }

      // move card
      $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      $el.style.zIndex = maxZ++;

      function onMousemove(e) {
        if (!isDraggable) {
          // is not draggable, do nothing
          return;
        }
        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }

        // move card
        $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      }

      function onMouseup(e) {
        if (isFlippable && Date.now() - starttime < 200) {
          // flip sides
          self.setSide(self.side === 'front' ? 'back' : 'front');
        }
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }
        if (!isDraggable) {
          // is not draggable, do nothing
          return;
        }

        // set current position
        self.x = self.x + pos.x - startPos.x;
        self.y = self.y + pos.y - startPos.y;
      }
    }

    function mount(target) {
      // mount card to target (deck)
      target.appendChild($el);

      self.$root = target;
    }

    function unmount() {
      // unmount from root (deck)
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }

    function setSide(newSide) {
      // flip sides
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
        $el.appendChild($face);
        self.setRankSuit(self.rank, self.suit);
      } else {
        if (self.side === 'front') {
          $el.removeChild($face);
        }
        self.side = 'back';
        $el.appendChild($back);
        $el.setAttribute('class', 'card');
      }
    }
  }

  function SuitName(suit) {
    // return suit name from suit value
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }
  var flip = {
    deck: function deck(_deck) {
      _deck.flip = _deck.queued(flip);

      function flip(next, side) {
        var flipped = _deck.cards.filter(function (card) {
          return card.side === 'front';
        }).length / _deck.cards.length;

        _deck.cards.forEach(function (card, i) {
          card.setSide(side ? side : flipped > 0.5 ? 'back' : 'front');
        });
        next();
      }
    }
  };

  var sort = {
    deck: function deck(_deck2) {
      _deck2.sort = _deck2.queued(sort);

      function sort(next, reverse) {
        var cards = _deck2.cards;

        cards.sort(function (a, b) {
          if (reverse) {
            return a.i - b.i;
          } else {
            return b.i - a.i;
          }
        });

        cards.forEach(function (card, i) {
          card.sort(i, cards.length, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          }, reverse);
        });
      }
    },
    card: function card(_card2) {
      var $el = _card2.$el;

      _card2.sort = function (i, len, cb, reverse) {
        var z = i / 4;
        var delay = i * 10;

        _card2.animateTo({
          delay: delay,
          duration: 400,

          x: -z,
          y: -150,
          rot: 0,

          onComplete: function onComplete() {
            $el.style.zIndex = i;
          }
        });

        _card2.animateTo({
          delay: delay + 500,
          duration: 400,

          x: -z,
          y: -z,
          rot: 0,

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function fontSize() {
    return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
  }

  var ____fontSize;

  var shuffleHand = {
    hand: function hand(_hand3) {
      _hand3.shuffle = _hand3.queued(shuffle);

      function shuffle(next) {
        var cards = _hand3.cards;
        ____fontSize = fontSize();

        fisherYates(cards);

        cards.forEach(function (card, i) {
          card.pos = i;

          card.shuffle(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
        return;
      }
    },

    card: function card(_card3) {
      var $el = _card3.$el;

      _card3.shuffle = function (cb) {
        var i = _card3.pos;
        var z = i / 4;
        var delay = i * 1;
        
        _card3.animateTo({
          delay: delay,
          duration: 100,
          x: _hand3.rootx + plusminus(Math.random() * 40 + 20),
          y: _hand3.rooty -z,
          rot: 0
        });
        _card3.animateTo({
          delay: 100 + delay,
          duration: 100,

          x: _hand3.rootx -z,
          y: _hand3.rooty -z,
          rot: 0,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var __fontSize;

  var _fontSize;

  var fan = {
    deck: function deck(_deck6) {
      _deck6.fan = _deck6.queued(fan);

      function fan(next) {
        var cards = _deck6.cards;
        var len = cards.length;

        _fontSize = fontSize();

        cards.forEach(function (card, i) {
          card.fan(i, len, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card6) {
      var $el = _card6.$el;

      _card6.fan = function (i, len, cb) {
        var z = i / 4;
        var delay = i * 10;
        var rot = i / (len - 1) * 260 - 130;

        _card6.animateTo({
          delay: delay,
          duration: 300,

          x: -z,
          y: -z,
          rot: 0
        });
        _card6.animateTo({
          delay: 300 + delay,
          duration: 300,

          x: Math.cos(deg2rad(rot - 90)) * 55 * _fontSize / 16,
          y: Math.sin(deg2rad(rot - 90)) * 55 * _fontSize / 16,
          rot: rot,

          onStart: function onStart() {
            $el.style.zIndex = i;
          },

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  var ___fontSize;

  var play = {
    card: function card(_card9) {
      _card9.play = function (cb) {
        _card9.animateTo({
          delay: 0,
          duration: 400,
          x: 0,
          y: 0,
          rot: 0,

          onComplete: function onComplete(){
            cb(_card9.i);
          }
        });
      };
    }
  }

  var bysuit = {
    deck: function deck(_deck7) {
      _deck7.bysuit = _deck7.queued(bysuit);
      function bysuit(next) {
        var cards = _deck7.cards;

        ___fontSize = fontSize();

        cards.forEach(function (card) {
          card.bysuit(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card7) {
      var rank = _card7.rank;
      var suit = _card7.suit;

      _card7.bysuit = function (cb) {
        var i = _card7.i;
        var delay = i * 10;

        _card7.animateTo({
          delay: delay,
          duration: 400,

          x: -Math.round((6.75 - rank) * 8 * ___fontSize / 16),
          y: -Math.round((1.5 - suit) * 92 * ___fontSize / 16),
          rot: Math.random()*30,

          onComplete: function onComplete() {
            cb(i);
          }
        });
      };
    }
  };

  function Hand(name, x=0, y=0) {
    // init cards array
    var cards = new Array(0);

    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, rootx: x, rooty: y, name: name, $el: $el });
    var $root;

    var modules = Deck.modules;
    var module;

    // make queueable
    queue(self);

    // load modules
    for (module in modules) {
      addModule(modules[module]);
    }

    // add class
    $el.classList.add('deck');

    var card;

    // create cards
    for (var i = cards.length; i; i--) {
      card = cards[i - 1] = _card(i - 1);
      card.setSide('back');
      card.mount($el);
    }

    return self;

    function mount(root) {
      // mount deck to root
      $root = root;
      $root.appendChild($el);
    }

    function unmount() {
      // unmount deck from root
      $root.removeChild($el);
    }

    function addModule(module) {
      module.deck && module.deck(self);
    }
  }
  Hand.animationFrames = animationFrames;
  Hand.ease = ease;
  Hand.modules = { bysuit: bysuit, fan: fan, play: play, shuffle: shuffleHand, sort: sort, flip: flip };
  Hand.Card = _card;
  Hand.prefix = prefix;
  Hand.translate = translate;
  return Hand;
})();
//// END HAND

//// AVATAR
var Avatar = (function() {
  // fallback
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });
  
  function _card(i){
    console.log('constructig card for avatar');
    // create elements
    var $el = createElement('div');
    var $face = createElement('div');
    var $back = createElement('div');

    var self = { i: i, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };
    
    // add classes
    $face.classList.add('face');
    $back.classList.add('back');

    // set default side
    self.setSide('back');
    
    // add default transform
    $el.style[transform] = translate(0 + 'px', 0 + 'px');
    
    self.animateTo = function (params) {
      console.log('animateTo (avatar)');
      var delay = params.delay;
      var duration = params.duration;
      var _params$x = params.x;
      var x = _params$x === undefined ? self.x : _params$x;
      var _params$y = params.y;
      var y = _params$y === undefined ? self.y : _params$y;
      var _params$z = params.z;
      var z = _params$z === undefined ? self.z : _params$z;
      var _params$rot = params.rot;
      var rot = _params$rot === undefined ? self.rot : _params$rot;
      var ease$$ = params.ease;
      var onStart = params.onStart;
      var onProgress = params.onProgress;
      var onComplete = params.onComplete;
      self.z = z;
      var startX, startY, startRot;
      var diffX, diffY, diffRot;

      animationFrames(delay, duration).start(function () {
        console.log('setting z to ' + z);
        $el.style.zIndex = z;
        startX = self.x || 0;
        startY = self.y || 0;
        startRot = self.rot || 0;
        onStart && onStart();
      }).progress(function (t) {
        var et = ease[ease$$ || 'cubicInOut'](t);

        diffX = x - startX;
        diffY = y - startY;
        diffRot = rot - startRot;

        onProgress && onProgress(t, et);

        self.x = startX + diffX * et;
        self.y = startY + diffY * et;
        self.rot = startRot + diffRot * et;

        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
      }).end(function () {
        onComplete && onComplete();
      });
    };

    // set rank & suit
    self.setRankSuit = function (i) {
      var suitName = SuitName(i);
      $el.setAttribute('class', 'card ' + suitName);
    };

    self.setRankSuit(i);

    function mount(target) {
      // mount card to target (deck)
      target.appendChild($el);
      self.$root = target;
    }

    function SuitName(i) {
      // return suit name from suit value
      return config.playerNames[i];
    }

    return self;
    
    function unmount() {
      // unmount from root (deck)
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }
    
    function setSide(newSide) {
      // flip sides
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
      $el.appendChild($face);
      self.setRankSuit(self.rank, self.suit);
    } else {
      if (self.side === 'front') {
        $el.removeChild($face);
      }
      self.side = 'back';
      $el.appendChild($back);
      $el.setAttribute('class', 'card');
    }
  }
  
}
  
  function Avatar(name, x=0, y=0, i=0){
    console.log('creating avatar');
    console.log(i);
    var cards = new Array(0);
    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
    var $root;
    
    // make queueable
    queue(self);

    // add class
    $el.classList.add('avatar');
      
    cards[0] = _card(i);
    cards[0].setSide('front');
    cards[0].mount($el);
    cards[0].setRankSuit(i);
    console.log(cards[0]);
    return self;
    
    function mount(root) {
      // mount deck to root
      $root = root;
      $root.appendChild($el);
    }

    function unmount() {
      // unmount deck from root
      $root.removeChild($el);
    }
  }

  Avatar.Card = _card;
  return Avatar;
})();
//// END AVATAR



//// PAGE LOAD
$(document).ready(function () {

  var $container = document.getElementById('container');
  var $topbar = document.getElementById('topbar');
  var $play = document.createElement('button');
  var $watch = document.createElement('button');
  var $reset = document.createElement('button');

  $play.textContent = 'Play';
  $watch.textContent = 'Watch';
  $reset.textContent = 'Reset';
  
  $topbar.appendChild($play);
  $topbar.appendChild($watch);
  $topbar.appendChild($reset);
  
  $play.addEventListener('click', function () {
    play();
  })

  $watch.addEventListener('click', function () {
    simulate();
  })

  $reset.addEventListener('click', function(){
    reset();
  })

  class Player {
    constructor(name, x, y, index) {
      this.name = name;
      this.hand = Hand(name, x, y);
      this.hand.mount($container);
      this.avatar = Avatar(name, x - 100, y - 100, index);
      this.avatar.mount($container);
      this.avatar.cards[0].animateTo({delay: 0, duration: 500, x: (2*index-1)*100, y: 0});
      this.speed = 100;
    }
    toString() {
      return this.name;
    }
  };

  function generatePlayers(){
    return config.playerNames.map(function (name, index) {    
      return new Player(name, 250*(2*index - 1), 0, index);
    });
  };

  var players = generatePlayers();
  var table;
  var gameinprogress = false;

  function log(msg){
    //document.getElementById('logdiv').innerHTML = msg;
    printMessage(msg);
    console.log(msg);
  };

  function pickUpCards(winner){
    var player = players[winner];
      log('player ' + player + ' picking up');
      while (table.cards.length > 0){
          var nc = table.cards.pop();
          nc.setSide('back');
          player.hand.cards.push(nc);
          nc.animateTo({
            delay: 0,
            duration: 200,
            x: player.hand.rootx - player.hand.cards.length/4,
            y: player.hand.rooty - player.hand.cards.length/4,
            z: player.hand.cards.length
          });
      }
  };

  function generateReactionTime(speed){
      var u = 0, v = 0;
      u = Math.random();
      v = Math.random();
      let num = Math.sqrt( -2.0 * Math.log(u))*Math.cos(2.0*Math.PI*v);
      num = num / 10.0 + 0.5;
      if (num > 1 || num < 0) return generateReactionTime(speed);
      return num;
  }

  function snapInner(winner){
    var player = players[winner];
    var k = table.cards.length;
    log('player ' + player + ' snaps');
    if (k > 1 && table.cards[k - 1 ].rank == table.cards[k - 2].rank){
      pickUpCards(winner);
    }
    else {
      log('too late!');
    }
  }

  function snap(){
    // model reaction times
    let reactions = players.map((p,i) => {
      let a = generateReactionTime(p.speed);
      return { idx: i, time: a }
    });

    let winner = reactions
        .reduce(function(acc, cv) {
            if (cv.time < acc.time) acc = cv;
            return acc;
        });

    let p = players[winner.idx];
    let k = table.cards.length;
    if (k > 1){
        let a = table.cards[k - 1];
        let b = table.cards[k - 2];
        if (a.rank == b.rank){             
          log('snapping');  
          setTimeout(function(){
                snapInner(winner.idx)
            }, 1000 * winner.time)
        }
    }
  };

  function playCard(currentPlayer){
    var player = players[currentPlayer];
    if (player.hand.cards.length == 0){
        log(player + ' lost. exiting...');
        gameinprogress = false;
        return -1;
    }
    var thisCard = player.hand.cards.pop();
    table.cards.push(thisCard);
    thisCard.setSide("front");
    thisCard.animateTo({
      delay: 10,
      duration: 200,
      x: table.rootx - table.cards.length/4,
      y: table.rooty - table.cards.length/4,
      z: table.cards.length,
      rot: 0
    });
    setTimeout(function() {
        snap();
    }, 1);
    currentPlayer = (currentPlayer + 1) % players.length;

    return processTurn(currentPlayer);
  };
  
  function processTurn(currentPlayer){
      // delay a bit, play card
      var d = 1000 - players[currentPlayer].speed;
      setTimeout(function() {
        if (gameinprogress){
          playCard(currentPlayer);
        }
      }, d);
  };
  
  //// Button Functions
  function play(){

  };

  function simulate(){
    log('Starting game');

    var deck = Deck();
    deck.mount($container);
    deck.shuffle();
    table = Hand("table", 0, 0);
  
    setTimeout(function(){
      deck.deal(players);
    }, 400);

    gameinprogress = true;
    let currentPlayer = 0;
    setTimeout(function(){
      processTurn(currentPlayer);
    }, 400);
  };

  function reset(){
    while ($container.lastChild){
      $container.removeChild($container.lastChild);
    }
    players = generatePlayers();
  };
});
//// END GAME
