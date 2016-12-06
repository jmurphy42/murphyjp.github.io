/**
 * Created by murphyjp on 12/6/2016.
 */
document.onkeydown = checkKey;

var interval = 1;
var cycle = 0;
var speed = 1;
var status = 1;
var timeElapsed = 0;
var direction = 0; //0up 1upright 2right 3downleft 4down 5downleft 6left 7upleft

function init(){
    loadHighScores();
    document.getElementById('jitter').onclick = checkClick;
}

function checkKey(e){
    e = e || window.event;
    var direction = e.keyCode;

    if (status == 0) {
        if (direction==13 || direction==32){ //space or enter
            location.reload();
        }
    }
}

function checkClick(e){
    if (status == 1){
        status++;
        startGame();
    }
}

function startGame(){
    cycleGame();
}

function cycleGame(){
    if (status > 1){
        cycle = setInterval(moveJitter,interval);
    }
}

function changeDirection(){
    var changeDirection = parseInt(Math.random() * 10);
    if (changeDirection==0) { //sharp sharp turn
        direction += 4;
        if (direction>7){ direction -= 8; }
    }else{
        changeDirection = parseInt(Math.random() * 12);
        if (changeDirection==0) {
            direction += 2;
        }else if(changeDirection==1) {
            direction -= 2;
        }else if(changeDirection<=4){
            direction -= 1;
        }else if(changeDirection<=7){
            direction -= 1;
        }
        if (direction>7){ direction -= 8; }
        if (direction<0){ direction += 8; }
    }
}

function changeSpeed(){
    var incSpeed = parseInt(timeElapsed/1000);
    incSpeed++;
    speed = incSpeed;
}

function moveJitter(){
    if (status > 1) {
        timeElapsed += interval;
        document.getElementById('moves').innerHTML=timeElapsed+"";

        changeDirection();
        changeSpeed();

        switch (direction) {
            case 0:
                moveUp(speed);
                break;
            case 1:
                moveUpRight(speed);
                break;
            case 2:
                moveRight(speed);
                break;
            case 3:
                moveDownRight(speed);
                break;
            case 4:
                moveDown(speed);
                break;
            case 5:
                moveDownLeft(speed);
                break;
            case 6:
                moveLeft(speed);
                break;
            case 7:
                moveUpLeft(speed);
                break;
        }
    }
}

function moveUp(speed){
    var jitter = document.getElementById('jitter');
    var topPos = jitter.offsetTop;

    if (topPos - speed >= 0) {
        jitter.style.top = (topPos - speed) + 'px';
    }
}
function moveDown(speed){
    var jitter = document.getElementById('jitter');
    var frame = document.getElementById('gameFrame');
    var topPos = jitter.offsetTop,
        botPos = topPos + jitter.offsetHeight;

    if (botPos + speed < frame.offsetHeight) {
        jitter.style.top = (topPos + speed) + 'px';
    }
}
function moveLeft(speed){
    var jitter = document.getElementById('jitter');
    var leftPos = jitter.offsetLeft;

    if (leftPos - speed >= 0) {
        jitter.style.left = (leftPos - speed) + 'px';
    }
}
function moveRight(speed){
    var jitter = document.getElementById('jitter');
    var frame = document.getElementById('gameFrame');
    var leftPos = jitter.offsetLeft,
        rightPos = leftPos + jitter.offsetWidth;

    if (rightPos + speed < frame.offsetWidth) {
        jitter.style.left = (leftPos + speed) + 'px';
    }
}

function moveUpLeft(speed){
    var partSpeed = parseInt(Math.sqrt(speed/2));
    moveUp(partSpeed);
    moveLeft(partSpeed);
}
function moveUpRight(speed){
    var partSpeed = parseInt(Math.sqrt(speed/2));
    moveUp(partSpeed);
    moveRight(partSpeed);
}
function moveDownLeft(speed){
    var partSpeed = parseInt(Math.sqrt(speed/2));
    moveDown(partSpeed);
    moveLeft(partSpeed);
}
function moveDownRight(speed){
    var partSpeed = parseInt(Math.sqrt(speed/2));
    moveDown(partSpeed);
    moveRight(partSpeed);
}

function mouseOffJitter(){
    if (status>1){
        clearInterval(cycle);
        jitterGotAway();
    }
}

function jitterGotAway(){
    //game over
    status = 0;
    document.getElementById("msg").style.display = "block";
    checkHighScore();
    updateHighScores();
}


function loadHighScores() {
    var jitterScores = ["0","0","0","0","0"];
    var jitterNames = ["Jitter","Jitter","Jitter","Jitter","Jitter"];
    for (var i = 0; i<5; i++) {
        if (localStorage.getItem("jitterScore"+(i+1)) != null) {
            jitterScores[i] = parseInt(localStorage.getItem(jitterScores[i]));
        }
        if (localStorage.getItem("jitterName"+(i+1)) != null) {
            jitterNames[i] = parseInt(localStorage.getItem(jitterNames[i]));
        }
    }
    for (var j = 0; i<5; i++) {
        document.getElementById(j+"s").innerHTML = jitterScores[j];
        document.getElementById(j+"i").innerHTML = jitterNames[j];
    }
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
    localStorage.setItem("jitterScore1",s1+"");
    localStorage.setItem("jitterScore2",s2+"");
    localStorage.setItem("jitterScore3",s3+"");
    localStorage.setItem("jitterScore4",s4+"");
    localStorage.setItem("jitterScore5",s5+"");
    localStorage.setItem("jitterName1",i1);
    localStorage.setItem("jitterName2",i2);
    localStorage.setItem("jitterName3",i3);
    localStorage.setItem("jitterName4",i4);
    localStorage.setItem("jitterName5",i5);
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

    if (timeElapsed > s5) {
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
    if (timeElapsed > s1){
        s5=s4;
        s4=s3;
        s3=s2;
        s2=s1;
        s1=timeElapsed;
        i5=i4;
        i4=i3;
        i3=i2;
        i2=i1;
        i1=yourInitials;
    }else if (timeElapsed > s2){
        s5=s4;
        s4=s3;
        s3=s2;
        s2=timeElapsed;
        i5=i4;
        i4=i3;
        i3=i2;
        i2=yourInitials;
    }else if (timeElapsed > s3){
        s5=s4;
        s4=s3;
        s3=timeElapsed;
        i5=i4;
        i4=i3;
        i3=yourInitials;
    }else if (timeElapsed > s4){
        s5=s4;
        s4=timeElapsed;
        i5=i4;
        i4=yourInitials;
    }else if (timeElapsed > s5){
        s5=timeElapsed;
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
    var s1 = 0,
        s2 = 0,
        s3 = 0,
        s4 = 0,
        s5 = 0,
        i1 = "Jitter",
        i2 = "Jitter",
        i3 = "Jitter",
        i4 = "Jitter",
        i5 = "Jitter";
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
    localStorage.setItem("jitterScore1",s1+"");
    localStorage.setItem("jitterScore2",s2+"");
    localStorage.setItem("jitterScore3",s3+"");
    localStorage.setItem("jitterScore4",s4+"");
    localStorage.setItem("jitterScore5",s5+"");
    localStorage.setItem("jitterName1",i1);
    localStorage.setItem("jitterName2",i2);
    localStorage.setItem("jitterName3",i3);
    localStorage.setItem("jitterName4",i4);
    localStorage.setItem("jitterName5",i5);
}