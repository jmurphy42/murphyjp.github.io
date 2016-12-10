/**
 * Created by murphyjp on 12/10/2016.
 */

var numBoxes = 4;
var numColors = 4;
var status = 1;
var boxColors = [0,0,0,0,0,0];
var codeColors = [0,0,0,0,0,0];
var exact = 0;
var almost = 0;
var colors = ["#8b8b8b", "#9a2517", "#217225", "#412944",
    "#904519", "#1f4d78", "#7a8824", "#f0f8ff"];
var exactChar = "●";
var almostChar = "o";
var emptyChar = "";

function init(){
    document.getElementById("msg").style.display = "none";
    var i;
    for (i = 0; i<6; i++) {
        document.getElementById("ba"+i).style.display = "none";
    }
    for (var j = 0; j<=15; j++){
        for (i = 0; i<6; i++) {
            document.getElementById("b"+j+i).style.display = "none";
        }
        document.getElementById("b"+j+"6").firstElementChild.innerHTML="";
    }
    for (i = 0; i<numBoxes; i++) {
        document.getElementById("b0"+i).style.display = "block";
        document.getElementById("ba"+i).style.display = "block";
        boxColors[i] = 0;
        document.getElementById("b0"+i).style.backgroundColor = colors[boxColors[i]];
    }

    document.getElementById("sepD").style.columnSpan = numBoxes;

    var gfWidth = (numBoxes)*43;
    document.getElementById("gameFrame").style.width = (gfWidth+50)+"px";
    document.getElementById("data").style.left = (gfWidth+250)+"px";

    document.getElementById("submit").style.marginLeft = ((((numBoxes)*42)-120)/2)+"px";

    setCode();
}

function setCode(){
    var random;
    for (var i = 0; i<6; i++) {
        random = parseInt(Math.random() * numColors);
        codeColors[i] = random;
    }
}

function changeColor(box){
    if (status > 0){
        boxColors[box]++;
        if(boxColors[box]>=numColors){
            boxColors[box]=0;
        }
        for (var i = 0; i<numBoxes; i++){
            document.getElementById("b0"+i).style.backgroundColor = colors[boxColors[i]];
        }
    }
}

function printCode(){
    var i;
    for (i = 0; i<numBoxes; i++) {
        var box = document.getElementById("b"+status+i);
        box.style.display = "block";
        box.style.backgroundColor = colors[boxColors[i]];
    }
}

function submitCode(){
    if (status > 0) {
        printCode();

        var wrongColors = [9, 9, 9, 9, 9, 9];
        var codeLeft = [8, 8, 8, 8, 8, 8];
        exact = 0;
        almost = 0;
        var i;
        for (i = 0; i < numBoxes; i++) {
            if (codeColors[i] == boxColors[i]) {
                //exact match
                exact++;
            } else {
                wrongColors[i] = boxColors[i];
                codeLeft[i] = codeColors[i];
            }
        }
        for (i = 0; i < numBoxes; i++) {
            for (var k = 0; k < numBoxes; k++) {
                if (wrongColors[i] == codeLeft[k]) {
                    almost++;
                    codeLeft[k] = 8;
                    k = numBoxes;
                }
            }
        }
        var results = document.getElementById("b" + (status) + "6").firstElementChild;
        results.innerHTML = "";
        for (i = 0; i < exact; i++) {
            results.innerHTML += exactChar;
        }
        for (i = 0; i < almost; i++) {
            results.innerHTML += almostChar;
        }
        for (i = 0; i < (numBoxes - exact - almost); i++) {
            results.innerHTML += emptyChar;
        }
        status++;

        if (exact == numBoxes) {
            setWin();
        }else if( status > 15){
            setLoss();
        }
    }
}

function setLoss(){
    status=0;

    var msg = "Game over. You lost.";

    for (var i = 0; i<6; i++){
        document.getElementById("ba"+i).style.backgroundColor = colors[codeColors[i]];
    }

    var gfWidth = parseInt(document.getElementById("gameFrame").style.width);
    var winFrameLeft = parseInt(((gfWidth-175)/2)-5);
    var winFrame = document.getElementById("msg");
    winFrame.innerHTML = msg;
    winFrame.style.backgroundColor = "#9a2517";
    winFrame.style.left = winFrameLeft+"px";
    winFrame.style.display = "block";
}

function setWin(){
    status=0;

    var msg = "Game over. Well done.";

    for (var i = 0; i<6; i++){
        document.getElementById("ba"+i).style.backgroundColor = colors[codeColors[i]];
    }

    var gfWidth = parseInt(document.getElementById("gameFrame").style.width);
    var winFrameLeft = parseInt(((gfWidth-175)/2)-5);
    var winFrame = document.getElementById("msg");
    winFrame.innerHTML = msg;
    winFrame.style.backgroundColor = "#252735";
    winFrame.style.left = winFrameLeft+"px";
    winFrame.style.display = "block";
}

function updateSettings(){
    var input = parseInt(document.getElementById("nColors").value);
    if (!isNaN(input) && input >= 3 && input <= 8){
        numColors = input;
    }

    input = parseInt(document.getElementById("nBoxes").value);
    if (!isNaN(input) && input >= 3 && input <= 6) {
        numBoxes = input;
    }

    document.getElementById("nColors").value = numColors;
    document.getElementById("nBoxes").value = numBoxes;

    revealTT2();

    init();
}

function revealTT2(){
    var reveal1 = document.getElementById("reveal1");
    var reveal2 = document.getElementById("reveal2");
    reveal1.style.opacity = 100;
    reveal2.style.opacity = 100;

    setTimeout(function(){
        reveal1.style.opacity = 0;
        reveal2.style.opacity = 0;
    }, 3000);
}