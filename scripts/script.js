'use strict';
//// CONFIG
var config = {
  numberOfCards: 52,
  playerNames: [ 'Ashley','Dracula'],
  turnSpeed: 600,
  cardSpeed: 200,
  defaultDelay: 600,
  defaultDuration: 1000,
  msgSpacing: 25
};
var msgs = [];
var rankNames = ['undefined?', 'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
var deckshuffled = false;
var cardsdealt = false;
//// END CONFIG

//// HELPERS
function printOutput (text) {
  console.log('PRINT: ' + text);
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease

  function moveUp(m, startY, endY){
    animationFrames(0,config.defaultDuration)
    .progress(function (t) {
        t = ease.cubicInOut(t)
        m.style[transform] = translate(($(document).width()/2 - 100) + 'px', (startY + ((endY-startY) * t)) + 'px')
    })
    .end(function() {
    })
  }

  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text
  $message.style.opacity = 0
  document.body.appendChild($message)
  var msgCount = msgs.length;
  msgs.forEach(function(m, i){
    var abc = m.style[transform];
    var oldY = -200 - (msgCount - i - 1)*config.msgSpacing;;
    var newY = oldY - config.msgSpacing;
    moveUp(m, oldY, newY);
  });
  msgs.push($message);

  animationFrames(0, config.defaultDuration)
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style.opacity = t;
      $message.style[transform] = translate(($(document).width()/2 - 100) + 'px', (-200 * t) + 'px')
    })
    .end(function () {
        setTimeout(function() {
        document.body.removeChild($message);
        }, 4000);
    })
}
function showInstructions(text){
  console.log('INSTRUCTION: ' + text);
  var animationFrames = Deck.animationFrames
  var ease = Deck.ease

  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text
  $message.style.opacity = 0
  document.body.appendChild($message)
  
  animationFrames(0, config.defaultDuration*3)
    .progress(function (t) {
      t = ease.cubicInOut(t)
      $message.style.opacity = t;
      $message.style[transform] = translate(($(document).width()/2 - 100) + 'px', (-80 * t) + 'px')
    })
    .end(function () {
        setTimeout(function() {
        document.body.removeChild($message);
        }, 4000);
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
function fontSize() {
  return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
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
    var name = RankName(rank) + ' of ' + SuitName(suit);

    // create elements
    var $el = createElement('div');
    var $face = createElement('div');
    var $back = createElement('div');

    // states
    var isDraggable = false;
    var isFlippable = false;
    
    // self = card
    var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide, name: name };

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
      console.log('moving the following card');
      console.log(self);
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
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }

  function RankName(rank) {
    return rankNames[rank];
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
          duration: config.cardSpeed,

          x: -z,
          y: -150,
          rot: 0,

          onComplete: function onComplete() {
            $el.style.zIndex = i;
          }
        });

        _card2.animateTo({
          delay: delay + 500,
          duration: config.cardSpeed,

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
        setTimeout(function(){
          deckshuffled = true;
        }, config.numberOfCards * 2 + config.defaultDelay + 2 * config.cardSpeed);
        return;
      }
    },

    card: function card(_card3) {
      var $el = _card3.$el;

      _card3.shuffle = function (cb) {
        var i = _card3.pos;
        var z = i / 4;
        var delay = i * 2;
        _card3.animateTo({
          delay: config.defaultDelay + delay,
          duration: config.cardSpeed,

          x: _card3.x + (plusminus(Math.random() * 40 + 20) * ____fontSize / 16),
          y: _card3.y - z,
          rot: 0
        });
        _card3.animateTo({
          delay: config.defaultDelay + delay + config.cardSpeed,
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,

          x: -z,
          y: -z,
          rot: 0
        });
        _card6.animateTo({
          delay: 300 + delay,
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,
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
          duration: config.cardSpeed,

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
      var tmp = 0;
      var cardsDealtPerPlayer = 0;
      while (cardsDealtPerPlayer < cards){
        // Deal card to every player
        players.forEach(function(player){
          if (self.cards.length > 0) {
            var nc = self.cards.pop();
            var x = player.hand.rootx - player.hand.cards.length/4;
            var y = player.hand.rooty - player.hand.cards.length/4;
            var z = player.hand.cards.length;
            player.hand.cards.push(nc);
            nc.animateTo({
              delay: 10*i,
              duration: config.cardSpeed,
              x: player.hand.rootx - player.hand.cards.length/4,
              y: player.hand.rooty - player.hand.cards.length/4,
              z: z
            });
            tmp += 1;
          }
          else {
            return -1;
          }
        });
        cardsDealtPerPlayer += 1;
      }
      setTimeout(function() {
        cardsdealt = true;
      }, config.cardSpeed)
    };
    self.deal = deal;

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
          duration: config.cardSpeed,

          x: -z,
          y: -150,
          rot: 0,

          onComplete: function onComplete() {
            $el.style.zIndex = i;
          }
        });

        _card2.animateTo({
          delay: delay + 500,
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,
          x: _hand3.rootx + plusminus(Math.random() * 400 + 20),
          y: _hand3.rooty -z,
          rot: 0
        });
        _card3.animateTo({
          delay: 100 + delay,
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,

          x: -z,
          y: -z,
          rot: 0
        });
        _card6.animateTo({
          delay: 300 + delay,
          duration: config.cardSpeed,

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
          duration: config.cardSpeed,
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
          duration: config.cardSpeed,

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
    console.log('constructing card for avatar');
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
  var $simulate = document.createElement('button');
  var $reset = document.createElement('button');
  var $yourTurn = document.createElement('p');

  $play.textContent = 'Play';
  $simulate.textContent = 'Simulate';
  $reset.textContent = 'Reset';
  $yourTurn.textContent = 'Your turn!';

  $topbar.appendChild($play);
  $topbar.appendChild($simulate);
  $topbar.appendChild($reset);

  var animationFrames = Deck.animationFrames
  var ease = Deck.ease

  $yourTurn.style.opacity = 0;
  $yourTurn.classList.add('instruction');
  $yourTurn.style[transform] = translate((-fontSize()*5)+'px', '0px')
  document.body.appendChild($yourTurn);
  
  $play.addEventListener('click', function () {
    play();
  })

  $simulate.addEventListener('click', function () {
    simulate();
  })

  $reset.addEventListener('click', function(){
    reset();
  })

  document.addEventListener('keydown', (event) => {
    if (event.keyCode == 65 && isUserTurn) {
        userPlayCard();
        itsYourTurn(false);
    }
    else if (event.keyCode == 83 && interactive ) {
        callSnap(0, true);
    }
  });

  class Player {
    constructor(name, index, mu=defaultmu, sigma=defaultsigma) {
      var x = 250*(2*index - 1);
      var y = 0;
      this.alive = true;
      this.name = name;
      this.nametext = document.createElement('p');
      this.nametext.textContent = name;
      this.nametext.classList.add('nametext');
      this.nametext.style[transform] = translate((x/2 - 35) + 'px', (y) + 'px');
      document.body.appendChild(this.nametext);
      this.hand = Hand(name, x, y);
      this.hand.mount($container);
      this.avatar = Avatar(name, x, y, index);
      this.avatar.mount($container);
      this.avatar.cards[0].animateTo({delay: 0, duration: 500, x: x/2, y: 0});
      this.cardCountText = document.createElement('p');
      this.cardCountText.classList.add('card-count');
      this.cardCountText.style[transform] = translate((x/2 - 35) + 'px',(y) + 'px');
      document.body.appendChild(this.cardCountText); 
      this.updateCardCount = () => this.cardCountText.textContent = "Cards: " + this.hand.cards.length;
      this.score = document.createElement('p');
      this.score.classList.add('score');
      this.points = 0;
      this.updateScore = () => this.score.textContent = 'Games won: ' + this.points;
      this.updateScore();
      this.score.style[transform] = translate((x/2 - 35) + 'px',(y) + 'px'); 
      document.body.appendChild(this.score);     
      this.mu = mu;
      this.sigma = sigma;
    }
    toString() {
      return this.name;
    }
  };

  function itsYourTurn(itisyourturn){
    animationFrames(0, config.defaultDuration/10)
    .progress(function (t) {
      t = ease.cubicInOut(t);
      if (itisyourturn) {
        $yourTurn.style.opacity = t;
      }
      else {
        $yourTurn.style.opacity = 1 - t;
      }
    });
  }

  function generatePlayers(){
    return config.playerNames.map(function (name, index) {    
      return new Player(name, index);
    });
  };

  function pickUpCards(winner){
    pickingUp = true;
    var player = players[winner];
    var tmp = 0;
    while (table.cards.length > 0){
        var nc = table.cards.pop();
        nc.setSide('back');
        player.hand.cards.push(nc);
        console.log('just picked up the following card from the table');
        console.log(nc);
        nc.animateTo({
            delay: 10 * tmp,
            duration: config.cardSpeed,
            x: player.hand.rootx - player.hand.cards.length/4,
            y: player.hand.rooty - player.hand.cards.length/4,
            z: player.hand.cards.length,
            rot: 0
        });
        player.updateCardCount();
        tmp += 0.5;
      }
    setTimeout(function () { pickingUp = false; }, 10*tmp + config.cardSpeed);
  };
  function generateGaussian(mu,sigma){
    var c = Math.cos(2 * Math.PI * Math.random());
    var s = Math.sqrt(-2 * Math.log(Math.random()));
    var g = mu + (c * s *sigma);
    return g;
  }
  function generateReactionTime(mu, sigma){
      return generateGaussian(mu,sigma);
  }

  function slam(winner, reactionTime){
    var player = players[winner];
    var k = table.cards.length;
    printOutput(player + ' slams their hand on the table! (reaction time: ' + reactionTime.toFixed(2) + ')');
    if (k > 1 && table.cards[k - 1].rank == table.cards[k - 2].rank){
      pickingUp = true;
      printOutput(player + ' picks up their winnings')
      pickUpCards(winner);
    }
    else {
      printOutput('... but is too slow!');
    }
  }

  function callSnap(playerId, wasUser = false){
    calculatedReactionTime = (Date.now() - cardplayedat)/1000;
    var k = table.cards.length;
    if (k > 1 && table.cards[k - 1].rank == table.cards[k - 2].rank){
      // Call was valid
      slam(playerId, calculatedReactionTime);
    }
    else {
      // Call was not valid
      if (wasUser){
        printOutput('Naughty!');
      }
    }
  }

  function simulateSnap(){
    var k = table.cards.length;
    if (k <= 1 || table.cards[k-1].rank != table.cards[k-2].rank){
      return;
    }
    var winningIdx;
    var winningTime;
    if (!interactive){
      let reactions = players.map((p,i) => {
        let a = generateReactionTime(p.mu, p.sigma);
        return { idx: i, time: a }
      });

      let winner = reactions
        .reduce(function(acc, cv) {
            if (cv.time < acc.time) acc = cv;
            return acc;
        });
      winningIdx = winner.idx;
      winningTime = winner.time;
    }
    else {
      let reactions = players.map((p,i) => {
        if (i > 0) {
          let a = generateReactionTime(p.mu, p.sigma); 
          return { idx: i, time: a }
        }
        else {
          return { idx: i, time: 99999}
        }
      });
 
      let winner = reactions
        .reduce(function(acc, cv) {
            if (cv.time < acc.time && cv.idx != 0) acc = cv;
            return acc;
        });
        winningIdx = winner.idx;
        winningTime = winner.time;
    }
    console.log(winningTime);

    setTimeout(function() {
      callSnap(winningIdx);
    }, winningTime*1000);
  }

  function userPlayCard(){
    isUserTurn = false;
    playCard(0);
    finishTurn();
  };

  function playCard(){
    console.log('playing card..');
    var player = players[currentPlayer];
    if (player.hand.cards.length == 0){
      console.log("Can't play card; hand empty");  
      return;
    }
    var thisCard = player.hand.cards.pop();
    player.updateCardCount();
    printOutput(player + ' plays the ' + thisCard.name + '!');
    table.cards.push(thisCard);
    thisCard.setSide("front");
    thisCard.animateTo({
      delay: 0,
      duration: config.cardSpeed,
      x: table.rootx - table.cards.length/4,
      y: table.rooty - table.cards.length/4,
      z: table.cards.length,
      rot: (Math.random() - 0.5)*10
    });
    cardplayedat = Date.now();
  };

  function finishTurn(){
    simulateSnap();
    setTimeout(function() { 
      currentPlayer = (currentPlayer + 1) % players.length;
      processTurn();
     }, config.defaultDelay);
  }
  
  function processTurn(){
    if (pickingUp){
      console.log('waiting for cards to be picked up...');
      setTimeout(processTurn, config.defaultDelay);
      return;
    }
    console.log('processing turn (player ' + currentPlayer + ')');
    if (players[currentPlayer].hand.cards.length == 0 && gameinprogress){
      printOutput(players[currentPlayer] + ' is out!');
      players[currentPlayer].alive = false;
      playersAlive -= 1;
      if (playersAlive == 1){
        var winner = players.filter(p => p.alive == true);
        console.log(winner);
        printOutput(winner[0] + ' wins!');
        winner[0].points += 1;
        winner[0].updateScore();
      }
      return;
    }

    if (interactive && currentPlayer == 0 && gameinprogress){
      itsYourTurn(true);
      isUserTurn = true;
      return; // await button press
    }

    if (gameinprogress && !pickingUp){
      console.log('setting timer for playCard call');
      setTimeout(function() {
        if (gameinprogress && !pickingUp){
          playCard();
          finishTurn();
        }
        else {
          console.log('waiting for cards to be picked up');
          setTimeout(processTurn, config.defaultDelay);
        }
      }, config.turnSpeed);
    }
  }
  
  function play(){
    $simulate.disabled = true;
    $play.disabled = true;
    $reset.disabled = false;
    
    printOutput('Starting game!');
    interactive = true;
    var deck = Deck();
    deck.mount($container);
    printOutput('Shuffling...');
    deck.shuffle();
    table = Hand("table", 0, 0);
    function deal() {
      if (deckshuffled) {
        printOutput('Dealing...');
        deck.deal(players);
      }
      else {
        console.log('waiting for cards to be shuffled');
        setTimeout(deal, config.defaultDelay);
      }
    }
    setTimeout(deal, config.defaultDelay);

    function startInteractiveGame() {
      if (cardsdealt) {
        printOutput('Starting interactive game...');
        showInstructions('Press A to play your next card, S to SNAP!');
        gameinprogress = true;
        isUserTurn = true;
        processTurn();
      }
      else {
        console.log('waiting for cards to be dealt');
        setTimeout(startInteractiveGame, config.defaultDelay);
      }
    }

    setTimeout(startInteractiveGame, config.defaultDelay);
  };

  function simulate(){
    $simulate.disabled = true;
    $reset.disabled = false;
    $play.disabled = true;
    printOutput('Starting simulation!');

    var deck = Deck();
    deck.mount($container);
    printOutput('Shuffling...');
    deck.shuffle();
    table = Hand("table", 0, 0);
    function deal(){
      if (deckshuffled) {
        printOutput('Dealing...');
        deck.deal(players);
      }
      else {
        console.log('waiting for cards to be shuffled');
        setTimeout(deal, config.defaultDelay);
      }
    }
    setTimeout(deal, config.defaultDelay);

    gameinprogress = true;
    function begin(){
      if (cardsdealt){
        processTurn();
      }
      else {
        console.log('waiting for cards to be dealt');
        setTimeout(begin, config.defaultDelay);
      }
    }
    setTimeout(begin, config.defaultDelay);
  };

  function newGame(){
    // similar to reset function but maintain games won stats
  }

  function reset(){
    $simulate.disabled = false;
    $play.disabled = false;
    $reset.disabled = true;

    gameinprogress = false;
    interactive = false;
    isUserTurn = false;
    pickingUp = false;
    cardsdealt = false;
    deckshuffled = false;
    printOutput('Resetting...');
    $('.card-count').remove();
    while ($container.lastChild){
      $container.removeChild($container.lastChild);
    }
    $("p").remove();
    players = generatePlayers();
    printOutput('...game is now reset');
  };

  // Define variables
  var table;
  var cardplayedat;
  var calculatedReactionTime;
  var defaultmu = 0.9;
  var defaultsigma = 0.2;
  var players = generatePlayers();
  var gameinprogress = false;
  var interactive = false;
  var isUserTurn = false;
  var pickingUp = false;
  var currentPlayer = 0;
  var playersAlive = config.playerNames.length;
});
//// END GAME
