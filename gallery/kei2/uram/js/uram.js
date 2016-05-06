/*
 * Uram
 *
 * Copyright (c) 2014 Kazuhito Kojima, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(function() {
  var myLog = function(msg) {
//    console.log(msg);
  }

  // local vars...
  var enemyNum = 3;
  var timeLimit = 18;
  var stage = 1;
  var score = 0;

  var hiScore = 0;
  if (localStorage.getItem("uram.hiScore")) {
     hiScore = localStorage.getItem("uram.hiScore");
  }

  var enemyInc = 2;
  var timeStep = 0;
  var alertTime = 3;

  var enemyStep = 32;

  var bgmOn = true;

  var canvas = $("#uramCanvas");
  var canvasWidth = canvas.get(0).width;
  var canvasHeight = canvas.get(0).height;

  canvas.inClick = false;
  canvas.clear = function() {
    var ctx = canvas.get(0).getContext('2d');
    ctx.clearRect(0,0, canvas[0].width, canvas[0].height);
  };
  canvas.beam = function(cx, cy, r) {
    var ctx = canvas.get(0).getContext('2d');
    //ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.fillStyle =  'rgba('+col()+','+col()+','+col()+',0.25)';
    ctx.beginPath();
    ctx.arc((cx*enemyStep)+enemyStep/2, (cy*enemyStep)+enemyStep/2,
            r*enemyStep, 0, Math.PI*2);
    ctx.stroke();
    ctx.fill();
    //ctx.restore();
  }
  canvas.hit = function(cx, cy) {
    var fire = $('<div/>');
    fire.addClass('fire').css('top', cy*enemyStep).css('left', cx*enemyStep);
    $('#uramGame').append(fire);
    setTimeout(function() {
      fire.remove();
    }, 1000);
  };

  function col() {
    return Math.floor(Math.random() * 255);
  }

  var SE = {
    beam: new Audio('se/beam.mp3'),
    hit: new Audio('se/hit.mp3'),
    alert: new Audio('se/alert.mp3'),
    over: new Audio('se/over.mp3'),
    play: function(name) {
      SE[name].pause();
      try {
        SE[name].currentTime = 0;  // 再生位置を0秒にする
      } catch (e) {
        // ignore
      }
      SE[name].play();
    }
  };

  var BGM = {
    current: null,
    title: new Audio('se/16569_symphony.mp3'),
    stage: [ new Audio('se/33564_aria-on-g.mp3'),
      new Audio('se/19775_kanon.mp3'),
      new Audio('se/25973_bolero.mp3'),
      new Audio('se/35440_gekko.mp3'),
      new Audio('se/1095_somp.mp3') ],
    clear: new Audio('se/33565_syuyo-bach.mp3'),
    over: new Audio('se/36036_ainoyume-orgel.mp3'),
    play: function(name) {
      this.stop();
      BGM[name].loop = false;
      BGM[name].volume = 0.3;
      BGM[name].play();
      this.current = BGM[name];
    },
    playStage: function(num) {
      this.stop();
      num = Math.floor(((num-1) / 2) % 5);
      BGM['stage'][num].volume = 0.3;
      BGM['stage'][num].play();
      this.current = BGM['stage'][num];
    },
    stop: function() {
      if (this.current != null) {
        if(!this.current.ended) {
          this.current.pause();
          try {
            this.current.currentTime = 0;  // 再生位置を0秒にする
          } catch (e) {
            // ignore
          }
        }
      }
    }
  };

  // jQueryUI settings ---
  $('#timeLimitBar').progressbar();
  $('#timeLimitBar').progressbar('option', {
    max: timeLimit,
    value: timeLimit
  });
  $('#start, #next, #demo, #backToGame').button();

  // class Enemy ----
  var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
  };
  
  Enemy.prototype.getDistanceFrom = function(fx, fy) {
    var dist = (this.x-fx)*(this.x-fx) + (this.y-fy)*(this.y-fy);
    return Math.sqrt(dist);
  };

 // class Enemies ----
  var Enemies = function(num) {
    this.num = num;
    this.rest = num;
    this.enemies = new Array();
    for(var i=0; i<num; i++) {
      this.enemies.push(new Enemy(
        Math.floor(Math.random()*(canvasWidth/enemyStep)),
        Math.floor(Math.random()*(canvasHeight/enemyStep))));
      myLog("e[" + i + "]=(" + this.enemies[i].x + ","
        + this.enemies[i].y + ")");
    }
    
    this.getNearestDistance = function(fx, fy) {
      var minDist = 10000;
      var eIndex = 0;
      for(var i=0; i<num; i++) {
        var dist = this.enemies[i].getDistanceFrom(fx, fy);
        if (dist < minDist) {
          minDist = dist;
          eIndex = i;
        }
      }
      return [eIndex, minDist];
    };
    
    this.destroyEnemy = function(index) {
      this.enemies[index].x = 100;
      this.enemies[index].y = 100;
      this.rest --;
    };
  };

  // Game Functinos
  function gameOver() {
    SE.play('over');
    
    if (hiScore < score) {
      hiScore = score;
      $('#hiScore').html(hiScore);
      localStorage.setItem("uram.hiScore", hiScore);
    }

    $('#message').addClass('gameover');
    $('#message').html('GAME OVER').show();
    $('#message').animate({
      color: "#f66",
      'font-size': "80px",
      padding: "132px 0px"
    }, 500, 'easeOutSine', function() {
      $('#message').animate({
        color: "#57d",
        'font-size': "64px",
        padding: "140px 0px"
      }, 1000);
      BGM.play('over');
    });

    $('#smText').html('');
    $('#next').hide();
    $('#start').show();
    $('#subMessage').show();

    enemyNum = 3;
    timeLimit = 18;
    score = 0;
    stage = 1;
    alertTime = 3;
  }
  
  function clearStage(timeRemaining) {
    $('#message').addClass('stageClear');
    $('#message').html('Stage Cleared!').show();
    $('#start, #next, #demo').hide();
    $('#subMessage').show();
    $('#smText').html('Bonus! <span id="bonus"></span> point').show();

    timeLimit += timeStep;
    enemyNum += enemyInc;
    stage ++;
    alertTime = 3;

    var bonus = Math.floor(timeRemaining)*10;
    setTimeout(function bonusLoop() {
      SE.play('beam');
      $('#bonus').html(bonus);
      $('#timeLimitBar').progressbar("option", "value", timeRemaining);
      $('#score').html(score);
      score += 5;
      bonus -= 5;
      timeRemaining -= 0.5;
      if (bonus > 0) {
        setTimeout(bonusLoop, 50);
      } else {
        $('#timeLimitBar').progressbar("option", "value", 0);
        $('#stage').html(stage);
        $('#score').html(score);
        $('#rest').html(enemyNum);

        $('#smText').fadeOut(500);
        setTimeout(function() {
          $('#next').fadeIn(500);
          BGM.play('clear');
        }, 500);
      }
    }, 50);
  }

  // main loop
  function mainLoop() {
    var gameTime = (Date.now() - startTime)/1000;
    $('#timeLimitBar').progressbar("value", timeLimit-gameTime);
    $('#stage').html(stage);
    $('#score').html(score);
    $('#rest').html(enemies.rest);
    
    if (enemies.rest == 0) {
      // stage clear
      clearInterval(mlId);
      clearStage(timeLimit-gameTime);
    } else if (timeLimit <= gameTime) {
      // game over
      clearInterval(mlId);
      $('#uramCanvas').css("backgroundColor","#fff");
      $('#uramCanvas').animate({
        backgroundColor: "#000"
      }, 1000);
      gameOver();
    } else if (timeLimit <= gameTime+alertTime) {
      SE.play('alert');
      $('#uramCanvas').css("backgroundColor","#fff");
      $('#uramCanvas').animate({
        backgroundColor: "#000"
      }, 200);
      alertTime--;
    }
  }

  // Controller logics ----
  var enemies = null;
  var startTime = 0;
  var mlId = 0;

  var uramController = {
    __name: 'UramBoardController',

    __init: function() {
      enemies = new Enemies(enemyNum);
      startTime = Date.now();
      mlId = 0;
      $('#score').html(score);
      $('#rest').html(enemies.rest);
      $('#hiScore').html(hiScore);
      $('#next').hide();
      BGM.play('title');
    },

  // UI CallBack ----
  '#start,#next click': function() {
    $('#message').fadeOut(500).removeClass('titleLogo');
    $('#subMessage').fadeOut(500);
    $('.desc').fadeOut(500);
    $('#timeLimitBar').progressbar({
      max: timeLimit,
      value: timeLimit
    });
    canvas.clear();

    enemies = new Enemies(enemyNum);
    startTime = Date.now();
    if (mlId != 0) clearInterval(mlId); // 為念
    mlId = window.setInterval(mainLoop, 100);
    BGM.playStage(stage);
  },

  '#demo click': function() {
    $('#uramBoard').fadeOut(500);
    setTimeout(function() {
      $('#video').fadeIn(500);
      demoController['playDemo']();
      BGM.stop();
    }, 500);
  },

  '#uramCanvas click': function(context) {
    if (canvas.inClick) return;
    canvas.inClick = true;

    var offset = $(context.event.target).offset();
    var offsetX = context.event.pageX - offset.left;
    var offsetY = context.event.pageY - offset.top;

    myLog("click:" + offsetX + "," + offsetY);
    SE.play('beam');
    
    var cx = Math.floor(offsetX / enemyStep);
    var cy = Math.floor(offsetY / enemyStep);
    
    var nd = enemies.getNearestDistance(cx, cy);
    myLog("click(x,y),id,r:(" + cx + "," + cy + ")," + nd);

    canvas.beam(cx, cy, nd[1]);

    if (nd[1] == 0) {
      // hit!!
      SE.play('hit');
      canvas.hit(cx, cy);
      enemies.destroyEnemy(nd[0]);
      score += 10;
    }
    canvas.inClick = false;
  },
}

  var demoController = {
    __name: 'demoController',

    __init: function() {
      $('#video').hide();
    },

    backToGame: function() {
      $('#video').fadeOut(500);
      $('#demoVideo').get(0).pause();
      setTimeout(function() {
        $('#uramBoard').fadeIn(500);
      }, 500);
    },

    playDemo: function() {
      $('#demoVideo').get(0).play();
      $('#demoVideo').get(0).addEventListener("ended",
        this['backToGame'], false);
    },

    '#backToGame click': function() {
      this['backToGame']();
    },
  }

  h5.core.controller('#uramBoard', uramController);
  h5.core.controller('#video', demoController);
});
