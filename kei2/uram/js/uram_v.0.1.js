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

(function() {
  // local vars...
  var enemyNum = 3;
  var timeLimit = 15;
  var enemyInc = 2;
  var timeStep = 2;
  var alertTime = 3;

  var enemyStep = 32;

  var stage = 1;
  var score = 0;
  var hiScore = 0;

  var canvas = $("#uramCanvas");
  var canvasWidth = canvas.get(0).width;
  var canvasHeight = canvas.get(0).height;

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
      SE[name].play();
      SE[name] = new Audio(SE[name].src);
    }
  };

  // jQueryUI settings ---
  $('#timeLimitBar').progressbar();
  $('#timeLimitBar').progressbar('option', {
    max: timeLimit,
    value: timeLimit
  });
  $('#start, #next').button();

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
      console.log("e[" + i + "]=(" + this.enemies[i].x + ","
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

  // UI CallBack ----
  var inClick = false;
  canvas.click(function(e) {
    if (inClick) return;
    inClick = true;
    console.log("click:" + e.offsetX + "," + e.offsetY);
    SE.play('beam');
    
    var cx = Math.floor(e.offsetX / enemyStep);
    var cy = Math.floor(e.offsetY / enemyStep);
    
    var nd = enemies.getNearestDistance(cx, cy);
    console.log("click(x,y),id,r:(" + cx + "," + cy + ")," + nd);

    canvas.beam(cx, cy, nd[1]);

    if (nd[1] == 0) {
      // hit!!
      SE.play('hit');
      canvas.hit(cx, cy);
      enemies.destroyEnemy(nd[0]);
      score += 10;
    }
    inClick = false;
  });

  // Controller logics ----
  var enemies = new Enemies(enemyNum);
  var startTime = Date.now();
  var mlId = 0;
  $('#hiScore').html(hiScore);
  $('#next').hide();
  
  function mainLoop() {
    var gameTime = (Date.now() - startTime)/1000;
    $('#timeLimitBar').progressbar("value", timeLimit-gameTime);
    $('#score').html(score);
    $('#rest').html(enemies.rest);
    
    // console.log(score + ',' + hiScore + ',' + enemies.rest + ',' + gameTime);
    
    if (enemies.rest == 0) {
      // stage clear
      clearInterval(mlId);
      clearStage(timeLimit-gameTime);
    }
    if (timeLimit <= gameTime) {
      // game over
      clearInterval(mlId);
      gameOver();
    } else if (timeLimit <= gameTime+alertTime) {
      SE.play('alert');
      alertTime--;
    }
  }

  function gameOver() {
    SE.play('over');
    
    if (hiScore < score) {
      hiScore = score;
      $('#hiScore').html(hiScore);
    }
    
    $('#message').html('GAME OVER').show();
    $('#smText').html('');
    $('#next').hide();
    $('#start').show();
    $('#subMessage').show();

    enemyNum = 3;
    timeLimit = 30;
    score = 0;
    stage = 1;
    alertTime = 3;
  }
  
  function clearStage(timeRemaining) {
    $('#message').html('Stage Cleared!').show();
    $('#start, #next').hide();
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
      score += 10;
      bonus -= 10;
      timeRemaining -= 1;
      if (bonus > 0) {
        setTimeout(bonusLoop, 50);
      } else {
        $('#timeLimitBar').progressbar("option", "value", 0);
        $('#stage').html(stage);
        $('#score').html(score);
        $('#rest').html(enemyNum);

        $('#smText').fadeOut(500);
        setTimeout(function() {$('#next').fadeIn(500);}, 500);
      }
    }, 50);
  }
  
  $('#start,#next').click(function() {
    $('#message').fadeOut(500);
    $('#subMessage').fadeOut(500);
    $('#timeLimitBar').progressbar({
      max: timeLimit,
      value: timeLimit
    });
    canvas.clear();

    enemies = new Enemies(enemyNum);
    startTime = Date.now();
    if (mlId != 0) clearInterval(mlId); // 為念
    mlId = window.setInterval(mainLoop, 100);
  });

})();
