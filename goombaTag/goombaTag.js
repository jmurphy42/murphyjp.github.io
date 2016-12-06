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
    e = e || window.event;
    var direction = e.keyCode;

    if (status > 0) {


        switch (direction) {
            case 87:
            case 38:
            case 65:
            case 37:
            case 83:
            case 40:
            case 68:
            case 39: //W-A-S-D or up-down-left-right
                movePlayer(direction);
                break;
        }
    }else{
        if (direction==13 || direction==32){ //space or enter
            location.reload()
        }
    }
}

function movePlayer(direction){
    var player = document.getElementById('player');
    switch (direction) {
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
        checkHighScore();
        updateHighScores();
    }
}

function loadHighScores() {
    var s1 = "999",
        s2 = "999",
        s3 = "999",
        s4 = "999",
        s5 = "999",
        i1 = "Goomba",
        i2 = "Goomba",
        i3 = "Goomba",
        i4 = "Goomba",
        i5 = "Goomba";
    if (localStorage.getItem("goombaScore1") != null) {
        s1 = parseInt(localStorage.getItem("goombaScore1"));
    }
    if (localStorage.getItem("goombaName1") != null) {
        i1 = localStorage.getItem("goombaName1");
    }
    if (localStorage.getItem("goombaScore2") != null) {
        s2 = parseInt(localStorage.getItem("goombaScore2"));
    }
    if (localStorage.getItem("goombaName2") != null) {
        i2 = localStorage.getItem("goombaName2");
    }
    if (localStorage.getItem("goombaScore3") != null) {
        s3 = parseInt(localStorage.getItem("goombaScore3"));
    }
    if (localStorage.getItem("goombaName3") != null) {
        i3 = localStorage.getItem("goombaName3");
    }
    if (localStorage.getItem("goombaScore4") != null) {
        s4 = parseInt(localStorage.getItem("goombaScore4"));
    }
    if (localStorage.getItem("goombaName4") != null) {
        i4 = localStorage.getItem("goombaName4");
    }
    if (localStorage.getItem("goombaScore5") != null) {
        s5 = parseInt(localStorage.getItem("goombaScore5"));
    }
    if (localStorage.getItem("goombaName5") != null) {
        i5 = localStorage.getItem("goombaName5");
    }

    document.getElementById("1s").innerHTML = s1;
    document.getElementById("1i").innerHTML = i1;
    document.getElementById("2s").innerHTML = s2;
    document.getElementById("2i").innerHTML = i2;
    document.getElementById("3s").innerHTML = s3;
    document.getElementById("3i").innerHTML = i3;
    document.getElementById("4s").innerHTML = s4;
    document.getElementById("4i").innerHTML = i4;
    document.getElementById("5s").innerHTML = s5;
    document.getElementById("5i").innerHTML = i5;
}

function updateHighScores() {
    var s1 = parseInt(document.getElementById("1s").innerHTML),
        s2 = parseInt(document.getElementById("2s").innerHTML),
        s3 = parseInt(document.getElementById("3s").innerHTML),
        s4 = parseInt(document.getElementById("4s").innerHTML),
        s5 = parseInt(document.getElementById("5s").innerHTML),
        i1 = document.getElementById("1i").innerHTML,
        i2 = document.getElementById("2i").innerHTML,
        i3 = document.getElementById("3i").innerHTML,
        i4 = document.getElementById("4i").innerHTML,
        i5 = document.getElementById("5i").innerHTML;
    localStorage.setItem("goombaScore1",s1+"");
    localStorage.setItem("goombaScore2",s2+"");
    localStorage.setItem("goombaScore3",s3+"");
    localStorage.setItem("goombaScore4",s4+"");
    localStorage.setItem("goombaScore5",s5+"");
    localStorage.setItem("goombaName1",i1);
    localStorage.setItem("goombaName2",i2);
    localStorage.setItem("goombaName3",i3);
    localStorage.setItem("goombaName4",i4);
    localStorage.setItem("goombaName5",i5);
}

function checkHighScore(){
    var s1 = parseInt(document.getElementById("1s").innerHTML),
        s2 = parseInt(document.getElementById("2s").innerHTML),
        s3 = parseInt(document.getElementById("3s").innerHTML),
        s4 = parseInt(document.getElementById("4s").innerHTML),
        s5 = parseInt(document.getElementById("5s").innerHTML),
        i1 = document.getElementById("1i").innerHTML,
        i2 = document.getElementById("2i").innerHTML,
        i3 = document.getElementById("3i").innerHTML,
        i4 = document.getElementById("4i").innerHTML,
        i5 = document.getElementById("5i").innerHTML;
    var yourInitials;
    var initialsValid = false;

    if (nMovements < s5) {
        while (!initialsValid) {
            yourInitials = prompt("You earned a place on the Score Board!\n" +
                "Enter your name or initials:", "You");
            if (yourInitials != null && yourInitials.length > 0) {
                if (yourInitials>15){
                    yourInitials = yourInitials.substring(0,15);
                }
                initialsValid = true;
            }
        }
    }
    if (nMovements < s1){
        s5=s4;
        s4=s3;
        s3=s2;
        s2=s1;
        s1=nMovements;
        i5=i4;
        i4=i3;
        i3=i2;
        i2=i1;
        i1=yourInitials;
    }else if (nMovements < s2){
        s5=s4;
        s4=s3;
        s3=s2;
        s2=nMovements;
        i5=i4;
        i4=i3;
        i3=i2;
        i2=yourInitials;
    }else if (nMovements < s3){
        s5=s4;
        s4=s3;
        s3=nMovements;
        i5=i4;
        i4=i3;
        i3=yourInitials;
    }else if (nMovements < s4){
        s5=s4;
        s4=nMovements;
        i5=i4;
        i4=yourInitials;
    }else if (nMovements < s5){
        s5=nMovements;
        i5=yourInitials;
    }
    document.getElementById("1s").innerHTML = s1+"";
    document.getElementById("2s").innerHTML = s2+"";
    document.getElementById("3s").innerHTML = s3+"";
    document.getElementById("4s").innerHTML = s4+"";
    document.getElementById("5s").innerHTML = s5+"";
    document.getElementById("1i").innerHTML = i1;
    document.getElementById("2i").innerHTML = i2;
    document.getElementById("3i").innerHTML = i3;
    document.getElementById("4i").innerHTML = i4;
    document.getElementById("5i").innerHTML = i5;
}

function resetScores(){
    var s1 = 999,
        s2 = 999,
        s3 = 999,
        s4 = 999,
        s5 = 999,
        i1 = "Goomba",
        i2 = "Goomba",
        i3 = "Goomba",
        i4 = "Goomba",
        i5 = "Goomba";
    document.getElementById("1s").innerHTML = s1+"";
    document.getElementById("2s").innerHTML = s2+"";
    document.getElementById("3s").innerHTML = s3+"";
    document.getElementById("4s").innerHTML = s4+"";
    document.getElementById("5s").innerHTML = s5+"";
    document.getElementById("1i").innerHTML = i1;
    document.getElementById("2i").innerHTML = i2;
    document.getElementById("3i").innerHTML = i3;
    document.getElementById("4i").innerHTML = i4;
    document.getElementById("5i").innerHTML = i5;
    localStorage.setItem("goombaScore1",s1+"");
    localStorage.setItem("goombaScore2",s2+"");
    localStorage.setItem("goombaScore3",s3+"");
    localStorage.setItem("goombaScore4",s4+"");
    localStorage.setItem("goombaScore5",s5+"");
    localStorage.setItem("goombaName1",i1);
    localStorage.setItem("goombaName2",i2);
    localStorage.setItem("goombaName3",i3);
    localStorage.setItem("goombaName4",i4);
    localStorage.setItem("goombaName5",i5);
}