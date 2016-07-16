/******************\
|   Velociraptor   |
|      Escape      |
| @author Anthony  |
| @version 1.0     |
| @date 2016/07/07 |
| @edit 2016/07/13 |
\******************/

var VelociraptorEscape = (function() {
  'use strict';

  /**********
   * config */

  /*************
   * constants */

  /*********************
   * working variables */

  /******************
   * work functions */
   function isLevelComplete(levelId, remaining) {
     return remaining.indexOf(levelId.toString()) === -1;
   }

  function initVelociraptorEscape() {
    //button things
    var runBtn = document.getElementById('run-btn');
    var submitBtn = document.getElementById('submit-btn');
    var watchBtn = document.getElementById('watch-btn');
    var resetBtn = document.getElementById('reset-btn');
    var prevLevelBtn = document.getElementById('prev-level-btn');
    var nextLevelBtn = document.getElementById('next-level-btn');
    var complexBtn = document.getElementById('complex-btn');

    var base_url = "/play/";
    var maxLevel = 4; // inclusive
    //Add prev/next level buttons
    var url = window.location.href.split("/");
    var username = url[url.length-2];
    var levelId = url[url.length-1];
    levelId = parseInt(levelId);
    if (levelId <= 0) {
      levelId = 0;
      prevLevelBtn.className += " disabled";
      nextLevelBtn.href = base_url + username + "/1";
    } else if (levelId > 0 && levelId < maxLevel) {
      prevLevelBtn.href = base_url + username + "/"+(levelId-1).toString();
      nextLevelBtn.href = base_url + username + "/"+ (levelId+1).toString();
    } else {
      levelId = maxLevel;
      prevLevelBtn.href = base_url + username + "/"+ (maxLevel-1).toString();
      nextLevelBtn.className += " disabled";
    }
    document.getElementById('level-id').innerHTML = levelId;

    Level.loadLevel(levelId.toString(), function(level) {
      GameEngine.init(level);
    });


    Http.get('/api/' + username + '/status', function(data) {
      if(data.verify !== null) {
        sendAlert('You completed the challenge!! Here is your key: ' + data.verify);
      } else if(isLevelComplete(levelId, data.remaining)) {
        sendAlert('You already completed this level! We still need levels ' + data.remaining);
      }
    });

    runBtn.addEventListener('click',function() {
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      disableButtons();
      try {
        GameEngine.run(
          text.replace(/\r/g, ''),

          function onCollision() {
            sendAlert('Oops! A velociraptor ate you! Looks like you need to listen to <a href="https://xkcd.com/135/">Mr. Monroe</a>');
            nomAgent();
            enableButtons();
          },

          function onSuccess(tooMuchCode) {
            if (tooMuchCode) {
              sendAlert('You made it, but you need to use fewer built-ins! Be more abstract ;)');
            } else {
              sendAlert('Congratulations! You beat the level! Click "submit" to validate your solution on the server and move on.');
            }
            enableButtons();
          },

          function onDone() {
            sendAlert('You weren\'t eaten alive, but you didn\'t escape in time!');
            enableButtons();
          }
        );
      } catch (e) {
        sendAlert(e.message);
        enableButtons();
      }
    });

    submitBtn.addEventListener('click', function() {
      disableButtons();
      var textarea = document.getElementById('textbox');
      var text = textarea.value;
      try {
        var url = window.location.href.split("/");
        var username = url[url.length-2];
        var levelId = url[url.length-1];
        Http.post(
          '/api/'+username+'/'+levelId+'/validate', {
            "text": text
          }, function(data) {
            if(data.verify !== null) {
              sendAlert('You completed the challenge!! Here is your key: ' + data.verify);
            } else if(isLevelComplete(levelId, data.remaining)) {
              sendAlert('Level verified! Keep going, we still need levels ' + data.remaining);
            } else {
              sendAlert('Submission failed');
            }

            enableButtons();
          }
        );
      } catch (e) {
        sendAlert(e.message);
        enableButtons();
        return;
      }
    });

    watchBtn.addEventListener('click', function(){
      disableButtons();
      GameEngine.watch(function() {
        enableButtons();
      });
    });

    resetBtn.addEventListener('click', function(){
      disableButtons();
      GameEngine.reset(function() {
        enableButtons();
      });
    });

    complexBtn.addEventListener('click', function(){
      var code = document.getElementById('textbox').value;
      var complexity = calculateComplexity(code);
      document.getElementById('code-complexity').innerHTML = complexity;
    });

    function disableButtons() {
      runBtn.disabled = true;
      submitBtn.disabled = true;
      watchBtn.disabled = true;
    }

    function enableButtons() {
      runBtn.disabled = false;
      submitBtn.disabled = false;
      watchBtn.disabled = false;
    }

    function calculateComplexity(code) {
      return GameEngine.getComplexity(code);
    }

    function nomAgent() {
      var agent = document.querySelectorAll('.fullClass.agentClass')[0];

      var rect = agent.getBoundingClientRect();
      var centerX = rect.left;
      var centerY = rect.top;
      var img = document.createElement('img');
      img.style.zIndex = 10001;
      img.style.position = 'fixed';
      img.style.top = centerY+ 'px';
      img.style.left = centerX + 'px';
      img.style.width = rect.width + 'px';
      img.style.height = rect.height + 'px';
      img.style.backgroundColor = 'white';
      img.src = '/images/nom.gif';
      img.style.transition = 'all 4s ease';
      document.body.insertBefore(img, document.body.childNodes[0]);
      setTimeout(function() {
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.top = 0;
          img.style.left = 0;
      }, 1000);
      setTimeout(function() {
          img.remove();
      }, 6000); 
    }
  }

  function sendAlert(message) {
    var alertBox = document.getElementById('alert');
    alertBox.innerHTML = message;
  }

  function clearAlert() {
    var alertBox = document.getElementById('alert');
    alertBox.innerHTML = '';
  }

// picoModal popup thing
  var modal = picoModal({
      content: "<h4>You're in a room with one hundred velociraptors. In order to survive... program your way out! <i>BUT IN WHAT LANGUAGE?</i></h4><h5> The rules are simple. Find a way to move your agent to the finish without <br>getting hit by any velociraptors.<br> <br> These are the built-in functions (don't use parens): <br> <code>moveUp, moveDown, moveLeft, moveRight</code> <br> <br>I wonder if there are others? What if there are built-ins that take parameters? <br> <br> What if <em>you   </em> had the power to create your own functions? <br> <br> But these raptors are smart, and listing out a step-by-step plan won't work... <br>Only elegant code programmed with finesse will survive these 'raptors. <br> <br></h5>",
      closeHtml: "<span>GOT IT !</span>",
      modalStyles:{
          color: "#0b3b4b",
          border: "7px solid #c9d41b",
          boxShadow: "10px 10px 53px -16px #000",
          position: "fixed", top: "20%",
          backgroundColor: "#fff",
          borderRadius: "10px"
      },
      closeStyles: {
          position: "fixed", bottom:"20px", right: "47%",
          background: "#ffbc29", padding: "5px 10px", cursor: "pointer",
          borderRadius: "10px",
          boxShadow: "0 9px #e4a418"
      },
      overlayStyles: {
          backgroundColor: "#000",
          opacity: 0.5

      }
  });
    document.getElementById("modal").addEventListener("click", function(){
    modal.show();
  });

  return {
    init: initVelociraptorEscape
  };
})();

window.addEventListener('load', VelociraptorEscape.init);
