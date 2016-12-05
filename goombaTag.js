/**
 * Created by murphyjp on 12/5/2016.
 */
document.onkeydown = checkKey;

var nMovements = 0;
var speed = 20;
var goombaSpeed = 20;
var status = 1;
var goombaStatus = [1,1,1,1,1,1,1,1,1,1];

function checkKey(e){
    if (status > 0) {
        var player = document.getElementById('player');

        e = e || window.event;

        switch (e.keyCode) {
            case 87:
            case 38: //W & up
                moveUp(player, speed);
                break;
            case 65:
            case 37: //A & left
                moveLeft(player, speed);
                break;
            case 83:
            case 40: //S & down
                moveDown(player, speed);
                break;
            case 68:
            case 39: //D & right
                moveRight(player, speed);
                break;
        }
        checkCollision();

        moveGoombas(goombaSpeed);
        nMovements++;
        document.getElementById('moves').innerHTML = nMovements+"";
    }
}

function moveGoombas(goombaSpeed) {
    for (var i = 0; i < 10; i++) {
        if (goombaStatus[i] == 1) {
            var goomba = document.getElementById('goomba' + (i));
            var randomDirection = parseInt(Math.random() * 4);
            switch (randomDirection) {
                case 0:
                    moveUp(goomba, goombaSpeed);
                    break;
                case 1:
                    moveDown(goomba, goombaSpeed);
                    break;
                case 2:
                    moveLeft(goomba, goombaSpeed);
                    break;
                case 3:
                    moveRight(goomba, goombaSpeed);
                    break;
            }
            checkCollision();
        }
    }
}

function moveUp(player, speed){
    var topPos = player.offsetTop;

    if (topPos - speed >= 0) {
        player.style.top = (topPos - speed) + 'px';
    }
}
function moveDown(player, speed){
    var frame = document.getElementById('gameFrame');
    var topPos = player.offsetTop,
        botPos = topPos + player.offsetHeight;

    if (botPos + speed < frame.offsetHeight) {
        player.style.top = (topPos + speed) + 'px';
    }
}
function moveLeft(player, speed){
    var leftPos = player.offsetLeft;

    if (leftPos - speed >= 0) {
        player.style.left = (leftPos - speed) + 'px';
    }
}
function moveRight(player, speed){
    var frame = document.getElementById('gameFrame');
    var leftPos = player.offsetLeft,
        rightPos = leftPos + player.offsetWidth;

    if (rightPos + speed < frame.offsetWidth) {
        player.style.left = (leftPos + speed) + 'px';
    }
}

function checkCollision(){
    var player = document.getElementById('player');
    for (var i = 0; i < 10; i++) {
        var goomba = document.getElementById('goomba'+(i));
        if (goombaStatus[i]==1 && goomba.offsetTop === player.offsetTop &&
            goomba.offsetLeft === player.offsetLeft){
            goombaStatus[i] = 0;
            goomba.style.backgroundColor = "#217225";
            status++;
        }
    }
    if (status==11){
        //game over
        status = 0;
        document.getElementById("msg").style.display = "block";
    }
}