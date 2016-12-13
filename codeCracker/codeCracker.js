/**
 * Created by murphyjp on 12/10/2016.
 */

var numBoxes = 4;
var numColors = 4;
var status = 1;
var boxColors = [0,0,0,0,0,0];
var codeColors = [0,0,0,0,0,0];
var currentBox = 0;
var exact = 0;
var almost = 0;
var colors = ["#8b8b8b", "#9a2517", "#217225", "#412944",
    "#904519", "#1f4d78", "#7a8824", "#f0f8ff"];
var colorSelectType = 0; //0 = toggle, 1 = menu
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

    status = 1;
}

function setCode(){
    var i;
    for (i = 0; i<6; i++){
        document.getElementById("ba"+i).style.backgroundColor = "#222222";
    }

    var random;
    for (i = 0; i<6; i++) {
        random = parseInt(Math.random() * numColors);
        codeColors[i] = random;
    }
}

function displayColorOptions(box){
    if (status>0) {
        if(colorSelectType==0) {
            toggleColorOption(box);
        }else{
            currentBox = box;
            var boxFrame = document.getElementById("b0" + box);
            var gameFrame = document.getElementById("gameFrame");
            var top = parseInt(boxFrame.offsetTop) + parseInt(gameFrame.offsetTop);
            var left = parseInt(boxFrame.offsetLeft) + parseInt(gameFrame.offsetLeft);
            var optionsWindow = document.getElementById("options");
            optionsWindow.style.top = (top + 16) + "px";
            optionsWindow.style.left = (left + 60) + "px";
            document.getElementById("cSeparator").style.opacity = 100;
            for (var i = 0; i < numColors; i++) {
                document.getElementById("c" + i).style.opacity = 100;
            }
        }
    }
}

function hideColorOptions(){
    document.getElementById("cSeparator").style.opacity = 0;
    for (var i = 0; i<8; i++){
        document.getElementById("c" + i).style.opacity = 0;
    }
}

function toggleColorOption(box){
    boxColors[box]++;
    if(boxColors[box]>=numColors){ //sanity check
        boxColors[box]=0;
    }
    document.getElementById("b0"+box).style.backgroundColor = colors[boxColors[box]];
}

function changeColor(colorChoice){
    hideColorOptions();
    if (status > 0){
        var selectedColor = colors[colorChoice];

        boxColors[currentBox] = colorChoice;
        if(boxColors[currentBox]>=numColors){ //sanity check
            boxColors[currentBox]=0;
        }
        document.getElementById("b0"+currentBox).style.backgroundColor = selectedColor;
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
    hideColorOptions();
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

function updateSettings(reveal){
    var input = parseInt(document.getElementById("nColors").value);
    if (!isNaN(input) && input >= 3 && input <= 8){
        numColors = input;
    }

    input = parseInt(document.getElementById("nBoxes").value);
    if (!isNaN(input) && input >= 3 && input <= 6) {
        numBoxes = input;
    }

    var radio = document.getElementById("colorPickerToggle");
    if (radio.checked){
        colorSelectType = 0;
    }else{
        colorSelectType = 1;
        document.getElementById("colorPickerMenu").checked = true;
    }

    document.getElementById("nColors").value = numColors;
    document.getElementById("nBoxes").value = numBoxes;

    if (reveal==1) {
        revealTT2();
    }

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