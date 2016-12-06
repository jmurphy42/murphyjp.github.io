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

        e = e || window.event;
        var direction = e.keyCode;

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
    var s1, s2, s3, s4, s5;
    var i1, i2, i3, i4, i5;
    if (localStorage.length==0){
        s1 = 999;
        s2 = 999;
        s3 = 999;
        s4 = 999;
        s5 = 999;
        i1 = "Goomba";
        i2 = "Goomba";
        i3 = "Goomba";
        i4 = "Goomba";
        i5 = "Goomba";
    }else{
        s1 = parseInt(localStorage.getItem("s1"));
        s2 = parseInt(localStorage.getItem("s2"));
        s3 = parseInt(localStorage.getItem("s3"));
        s4 = parseInt(localStorage.getItem("s4"));
        s5 = parseInt(localStorage.getItem("s5"));
        i1 = localStorage.getItem("i1");
        i2 = localStorage.getItem("i2");
        i3 = localStorage.getItem("i3");
        i4 = localStorage.getItem("i4");
        i5 = localStorage.getItem("i5");
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

function updateHighScores() {
    var s1 = parseInt(document.getElementById("1s").innerHTML);
    var s2 = parseInt(document.getElementById("2s").innerHTML);
    var s3 = parseInt(document.getElementById("3s").innerHTML);
    var s4 = parseInt(document.getElementById("4s").innerHTML);
    var s5 = parseInt(document.getElementById("5s").innerHTML);
    var i1 = document.getElementById("1i").innerHTML;
    var i2 = document.getElementById("2i").innerHTML;
    var i3 = document.getElementById("3i").innerHTML;
    var i4 = document.getElementById("4i").innerHTML;
    var i5 = document.getElementById("5i").innerHTML;
    localStorage.setItem("s1",s1+"");
    localStorage.setItem("s2",s2+"");
    localStorage.setItem("s3",s3+"");
    localStorage.setItem("s4",s4+"");
    localStorage.setItem("s5",s5+"");
    localStorage.setItem("i1",i1);
    localStorage.setItem("i2",i2);
    localStorage.setItem("i3",i3);
    localStorage.setItem("i4",i4);
    localStorage.setItem("i5",i5);
}

function checkHighScore(){
    var s1 = parseInt(document.getElementById("1s").innerHTML);
    var s2 = parseInt(document.getElementById("2s").innerHTML);
    var s3 = parseInt(document.getElementById("3s").innerHTML);
    var s4 = parseInt(document.getElementById("4s").innerHTML);
    var s5 = parseInt(document.getElementById("5s").innerHTML);
    var i1 = document.getElementById("1i").innerHTML;
    var i2 = document.getElementById("2i").innerHTML;
    var i3 = document.getElementById("3i").innerHTML;
    var i4 = document.getElementById("4i").innerHTML;
    var i5 = document.getElementById("5i").innerHTML;
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
    s1 = 999;
    s2 = 999;
    s3 = 999;
    s4 = 999;
    s5 = 999;
    i1 = "Goomba";
    i2 = "Goomba";
    i3 = "Goomba";
    i4 = "Goomba";
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
    localStorage.setItem("s1",s1+"");
    localStorage.setItem("s2",s2+"");
    localStorage.setItem("s3",s3+"");
    localStorage.setItem("s4",s4+"");
    localStorage.setItem("s5",s5+"");
    localStorage.setItem("i1",i1);
    localStorage.setItem("i2",i2);
    localStorage.setItem("i3",i3);
    localStorage.setItem("i4",i4);
    localStorage.setItem("i5",i5);
}