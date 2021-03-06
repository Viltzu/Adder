var playerName;
var playerNameInput = document.getElementById('playerNameInput');
var playerNameInput2 = document.getElementById('playerNameInput2');
var socket;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

/*var c = document.getElementById('cvs');
var canvas = c.getContext('2d');
c.width = screenWidth; c.height = screenHeight;*/

var KEY_ENTER = 13;

var game = new Game();

var netLoopId, logicLoopId;

function startGame() {
    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
	playerNameInput2.value = playerName;
    document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('startMenuWrapper').style.display = 'none';

	socket = io({ forceNew: true });
    SetupSocket(socket);

	netLoopId = setInterval(game.netLoop, 1000 / 60)
	logicLoopId = setInterval(game.logicLoop, 1000 / 60);
}

function restartGame() {
	$("svg").find("." + me.slice(-4)).remove();
	playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
    document.getElementById('gameAreaWrapper').style.display = 'block';
    document.getElementById('endMenuWrapper').style.display = 'none';	
	socket.connect();
	netLoopId = setInterval(game.netLoop, 1000 / 60)
	logicLoopId = setInterval(game.logicLoop, 1000 / 60);
}

function endGame() {
	clearInterval(netLoopId);
	clearInterval(logicLoopId);
	delete netLoopId;
    delete logicLoopId;
	
	document.getElementById('gameAreaWrapper').style.display = 'none';
	document.getElementById('endMenuWrapper').style.display = 'block';
	
	playerNameInput2.focus();

	$('#bestPosition').html("best position: " + (document.bestPosition + 1));
	$('#score').html("score: " + document.score);
}

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    var regex = /^\w*$/;
    //console.log('Regex Test', regex.exec(playerNameInput.value));
    return regex.exec(playerNameInput.value) !== null;
}

window.onload = function() {
    'use strict';
	var rebtn = document.getElementById('restartButton'),
		btn = document.getElementById('startButton'),
        nickErrorText = document.querySelector('.input-error');

    btn.onclick = function () {
        if (validNick()) {
            startGame();
        } else {
            nickErrorText.style.display = 'inline';
        }
    };
	
	rebtn.onclick = function () {
        if (validNick()) {
            if (validNick()) {
				restartGame();
			} else {
				nickErrorText.style.display = 'inline';
			}
        }
    };

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === KEY_ENTER) {
            if (validNick()) {
				startGame();
            } else {
                nickErrorText.style.display = 'inline';
            }
        }
    });
	
    playerNameInput2.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === KEY_ENTER) {
            if (validNick()) {
				restartGame();
            } else {
                nickErrorText.style.display = 'inline';
            }
        }
    });	
};

function SetupSocket(socket) {
  game.handleNetwork(socket);
}

window.addEventListener('resize', function() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
}, true);
