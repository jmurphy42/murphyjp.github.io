/**
 * Created by murphyjp on 12/11/2016.
 */
var currentSquare;
var previousSquare;
var status = 0;

var gridData = [];
var newGridData = [];
var history1 = [],
    history2 = [],
    history3 = [],
    history4 = [],
    history5 = [];

var worldSave = [];

var delay = 100;
var changedCells = 0;
var generations = 0;
var looper;

function run() {

    clearInterval(looper);
    looper = setInterval(run, delay);

    for (var dx = 0; dx < 80; dx++) {      //for all x rows
        for (var dy = 0; dy < 80; dy++) {  //for all y cells in x row
            var cellSum = getNeighbors(dx, dy);
            switch (cellSum) {
                case 0:
                case 1:
                    //die
                    newGridData[dx][dy] = 0;
                    break;
                case 2:
                    //persist
                    newGridData[dx][dy] = gridData[dx][dy]; //live if alive, dead if dead
                    break;
                case 3:
                    //persist or become alive
                    newGridData[dx][dy] = 1;
                    break;
                default:
                    //die
                    newGridData[dx][dy] = 0;
                    break;
            }
        }
    }

    paintNew();
    copyNewOntoOld();
    generations++;
    reportStats();
    recordHistory();
    checkActivity();

    function reportStats() {
        document.getElementById("report").innerHTML =
            "<h3 class='stat'>" + "Generations: " + generations + "</h3>" +
            "<h3 class='stat'>" + " Cells: " + getGridCount(gridData) + "</h3>" +
            "<h3 class='stat'>" + "Active Cells: " + changedCells + "</h3>";
    }

    function copyNewOntoOld() {
        //copy newGridData onto gridData
        changedCells = 0;
        for (var ddx = 0; ddx < 80; ddx++) {      //for all x rows
            for (var ddy = 0; ddy < 80; ddy++) {  //for all y cells in x row
                if (gridData[ddx][ddy] != newGridData[ddx][ddy]) {
                    changedCells++;
                }
                gridData[ddx][ddy] = newGridData[ddx][ddy];
            }
        }
    }

    function getNeighbors(x, y) {
        var ul, u, ur, l, r, dl, d, dr;
        if ((x - 1) < 0 || (y - 1) < 0) {
            ul = 0;
        } else {
            ul = gridData[(x - 1)][(y - 1)];
        }
        if ((y - 1) < 0) {
            u = 0;
        } else {
            u = gridData[(x)][(y - 1)];
        }
        if ((x + 1) > 79 || (y - 1) < 0) {
            ur = 0;
        } else {
            ur = gridData[(x + 1)][(y - 1)];
        }
        if ((x - 1) < 0) {
            l = 0;
        } else {
            l = gridData[(x - 1)][(y)];
        }
        if ((x + 1) > 79) {
            r = 0;
        } else {
            r = gridData[(x + 1)][(y)];
        }
        if ((x - 1) < 0 || (y + 1) > 79) {
            dl = 0;
        } else {
            dl = gridData[(x - 1)][(y + 1)];
        }
        if ((y + 1) > 79) {
            d = 0;
        } else {
            d = gridData[(x)][(y + 1)];
        }
        if ((x + 1) > 79 || (y + 1) > 79) {
            dr = 0;
        } else {
            dr = gridData[(x + 1)][(y + 1)];
        }
        return ul + u + ur + l + r + dl + d + dr;
    }

    function paintNew() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        for (var dx = 0; dx < 80; dx++) {      //for all x rows
            for (var dy = 0; dy < 80; dy++) {  //for all y cells in x row
                fillSquare(context, dx, dy, newGridData[dx][dy]);
            }
        }
    }

    function fillSquare(context, dx, dy, type) {
        var cSelected = "#222222";
        var cUnselected = "#dddddd";

        var x = dx * 8 + 1; //get x pixel
        var y = dy * 8 + 1; //get y pixel

        if (type == 1) {
            context.fillStyle = cSelected;
            context.fillRect(x, y, 7, 7);
        } else if (type == 0) {
            context.fillStyle = cUnselected;
            context.fillRect(x, y, 7, 7);
        }
    }

    function checkActivity() {
        var duplicate = isDuplicate(history1,history2) ||
            isDuplicate(history1,history3) ||
            isDuplicate(history1,history4) ||
            isDuplicate(history1,history5) ||
            isDuplicate(history2,history3) ||
            isDuplicate(history2,history4) ||
            isDuplicate(history2,history5) ||
            isDuplicate(history3,history4) ||
            isDuplicate(history3,history5) ||
            isDuplicate(history4,history5);

        function isDuplicate(grid1, grid2) {
            for (var x = 0; x < 80; x++) {      //for all x rows
                for (var y = 0; y < 80; y++) {  //for all y cells in x row
                    if (grid2[x][y] != grid1[x][y]){
                        return false;
                    }
                }
            }
            return true;
        }

        if (duplicate){
            stopLooper();
        }
    }
}

function runLooper() {
    if (status == 0) {
        generations = 0;
        var frame = document.getElementById("gameFrame");
        frame.style.borderColor = "#9a2517";
        frame = document.getElementById("outerFrame");
        frame.style.borderColor = "#9a2517";
        status = 1;
        clearInterval(looper);
        looper = setInterval(run, delay);
    }
}

function stopLooper() {
    if (status == 1) {
        var frame = document.getElementById("gameFrame");
        frame.style.borderColor = "#252735";
        frame = document.getElementById("outerFrame");
        frame.style.borderColor = "gainsboro";
        clearInterval(looper);
        status = 0;
    }
}

function saveWorld() {
    stopLooper();
    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < 80; y++) {
            worldSave[x][y] = gridData[x][y];
        }
    }
}

function loadFromFile(fileName){
    var client = new XMLHttpRequest();
    try {
        client.open('GET', fileName);
        client.onreadystatechange = function () {
            var text = client.responseText;
            readFile(text);
        };
        client.send();
    }catch(IOException){
        alert("The file name supplied was not found.");
    }
}

function readFile(text){
    for (var y = 0; y < 80; y++) {
        for (var x = 0; x < 80; x++) {
            gridData[x][y] = parseInt(text.charAt(x+(y*80)));
        }
    }
    paintNewWorld();
}

function paintNewWorld(){
    paintNew();
    fillGrid(history1, 1);
    fillGrid(history2, 2);
    fillGrid(history3, 3);
    fillGrid(history4, 4);
    fillGrid(history5, 5);

    function paintNew() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        for (var dx = 0; dx < 80; dx++) {      //for all x rows
            for (var dy = 0; dy < 80; dy++) {  //for all y cells in x row
                fillSquare(context, dx, dy, gridData[dx][dy]);
            }
        }
    }

    function fillSquare(context, dx, dy, type) {
        var cSelected = "#222222";
        var cUnselected = "#dddddd";

        var x = dx * 8 + 1; //get x pixel
        var y = dy * 8 + 1; //get y pixel

        if (type == 1) {
            context.fillStyle = cSelected;
            context.fillRect(x, y, 7, 7);
        } else if (type == 0) {
            context.fillStyle = cUnselected;
            context.fillRect(x, y, 7, 7);
        }
    }
}

function restoreWorld() {
    stopLooper();

    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < 80; y++) {
            gridData[x][y] = worldSave[x][y];
        }
    }

    paintNewWorld();
}

function fillGrid(grid, value){
    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < 80; y++) {
            grid[x][y] = value;
        }
    }
}

function recordHistory() {
    //shift histories
    copy(history4,history5);
    copy(history3,history4);
    copy(history2,history3);
    copy(history1,history2);
    copy(newGridData,history1);

    //copy grid onto other grid
    function copy(copyGrid, pasteToGrid) {
        for (var x = 0; x < 80; x++) {      //for all x rows
            for (var y = 0; y < 80; y++) {  //for all y cells in x row
                pasteToGrid[x][y] = copyGrid[x][y];
            }
        }
    }
}

function getGridCount(grid) {
    var sum = 0;
    for (var x = 0; x < 80; x++) {      //for all x rows
        for (var y = 0; y < 80; y++) {  //for all y cells in x row
            sum += grid[x][y];
        }
    }
    return sum;
}

function verifySpeed() {
    var speedInput = document.getElementById("speed");
    var speedValue = parseInt(speedInput.value);
    if (isNaN(speedValue) || speedValue < 20 || speedValue > 1000) {
        speedInput.value = delay + "";
    } else {
        delay = speedValue;
    }
}

function init() {
    var mouseMode = "none";
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    setUpGridData();

    drawGrid(context);
    addMouseOver();
    addMouseClick();
    addMouseOut();

    function setUpGridData() {
        //Create a gridData 80x80 array of arrays to hold cell 1/0 status.
        for (var x = 0; x < 80; x++) {
            var yArray1 = []; //create a new yArray.
            var yArray2 = []; //create a new yArray.
            var yArray3 = []; //create a new yArray.
            var yArray4 = []; //create a new yArray.
            var yArray5 = []; //create a new yArray.
            var yArray6 = []; //create a new yArray.
            var yArray7 = []; //create a new yArray.
            var yArray8 = []; //create a new yArray.
            for (var y = 0; y < 80; y++) {
                yArray1.push(0); //give a yArray 80 cells.
                yArray2.push(0); //give a yArray 80 cells.
                yArray3.push(0); //give a yArray 80 cells.
                yArray4.push(1); //give a yArray 80 cells.
                yArray5.push(2); //give a yArray 80 cells.
                yArray6.push(3); //give a yArray 80 cells.
                yArray7.push(4); //give a yArray 80 cells.
                yArray8.push(5); //give a yArray 80 cells.
            }
            gridData.push(yArray1); //add the new yArray to grid 80 times.
            newGridData.push(yArray2); //add the new yArray to grid 80 times.
            worldSave.push(yArray3); //add the new yArray to grid 80 times.
            history1.push(yArray4); //add the new yArray to grid 80 times.
            history2.push(yArray5); //add the new yArray to grid 80 times.
            history3.push(yArray6); //add the new yArray to grid 80 times.
            history4.push(yArray7); //add the new yArray to grid 80 times.
            history5.push(yArray8); //add the new yArray to grid 80 times.
        }
        //the structure is: gridData[x][y] = cell (x,y)
        //                  gridData[0][0] = top left cell (0,0)
        //                  gridData[80][0] = top right cell (80,0)
    }

    function getSquare(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: 1 + (event.clientX - rect.left) - (event.clientX - rect.left) % 8,
            y: 1 + (event.clientY - rect.top) - (event.clientY - rect.top) % 8
        };
    }

    function getCell(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((event.clientX - rect.left) / 8),
            y: Math.floor((event.clientY - rect.top) / 8)
        };
    }

    function drawGrid(context) {
        for (var x = 0.5; x < 641; x += 8) {
            context.moveTo(x, 0);
            context.lineTo(x, 640);
        }

        for (var y = 0.5; y < 641; y += 8) {
            context.moveTo(0, y);
            context.lineTo(640, y);
        }

        context.strokeStyle = "#cccccc";
        context.stroke();
    }

    function fillSquare(context, px, py, cx, cy, type) {
        var p = context.getImageData(px, py, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        var cSelected = "#222222";
        var cSelectedHover = "#5533ff";
        var cUnselected = "#dddddd";
        var cUnselectedHover = "#8b8b8b";

        if (type == "click") {
            if (hex == cSelected || hex == cSelectedHover) {
                context.fillStyle = cUnselected;
                context.fillRect(px, py, 7, 7);
                gridData[cx][cy] = 0;
                mouseMode = "unselecting";
            } else {
                context.fillStyle = cSelected;
                context.fillRect(px, py, 7, 7);
                gridData[cx][cy] = 1;
                mouseMode = "selecting";
            }
        } else if (type == "clickmove") {
            if (mouseMode == "unselecting") {
                context.fillStyle = cUnselected;
                context.fillRect(px, py, 7, 7);
                gridData[cx][cy] = 0;
            } else if (mouseMode == "selecting") {
                context.fillStyle = cSelected;
                context.fillRect(px, py, 7, 7);
                gridData[cx][cy] = 1;
            }
        } else if (type == "hover") {
            if (hex == cSelected || hex == cSelectedHover) {
                context.fillStyle = cSelectedHover;
                context.fillRect(px, py, 7, 7);
            } else {
                context.fillStyle = cUnselectedHover;
                context.fillRect(px, py, 7, 7);
            }
        } else if (type == "unhover") {
            if (hex == cSelectedHover || hex == cSelected) {
                context.fillStyle = cSelected;
                context.fillRect(px, py, 7, 7);
            } else {
                context.fillStyle = cUnselected;
                context.fillRect(px, py, 7, 7);
            }
        }

    }

    function addMouseOut() {
        canvas.addEventListener('mouseout', function (event) {
            if (status == 0) {
                document.getElementById("cellReport").innerHTML =
                    "";
                canvas.style.cursor = "default";
                fillSquare(context, previousSquare.x, previousSquare.y, 0, 0, "unhover");
                if (event.which == 0) { //mouse button not down
                    mouseMode = "none";
                }
            } else {
                canvas.style.cursor = "default";
            }
        }, false);
    }

    function addMouseClick() {
        canvas.addEventListener('click', function (event) {
            if (status == 0) {
                canvas.style.cursor = "default";
                var mousePos = getSquare(canvas, event);
                var cellPos = getCell(canvas, event);
                var yPos = cellPos.y,
                    xPos = cellPos.x;
                if (yPos == -1) {
                    yPos = 0;
                }
                if (xPos == -1) {
                    xPos = 0;
                }
                currentSquare = mousePos;
                fillSquare(context, mousePos.x, mousePos.y, xPos, yPos, "click");
            } else {
                canvas.style.cursor = "crosshair";
            }
        }, false);
    }

    function addMouseOver() {
        canvas.addEventListener('mousemove', function (event) {
            if (status == 0) {
                canvas.style.cursor = "default";
                var mousePos = getSquare(canvas, event);
                var cellPos = getCell(canvas, event);
                var yPos = cellPos.y,
                    xPos = cellPos.x;
                if (yPos == -1) {
                    yPos = 0;
                }
                if (xPos == -1) {
                    xPos = 0;
                }
                document.getElementById("cellReport").innerHTML =
                    "Cell: (" + (xPos + 1) + "," + (yPos + 1) + ")";
                if (event.which == 1) { //mouse button down
                    currentSquare = mousePos;
                    fillSquare(context, mousePos.x, mousePos.y, xPos, yPos, "clickmove");
                } else {               //mouse button up
                    if (currentSquare != mousePos) {
                        previousSquare = currentSquare;
                    }
                    currentSquare = mousePos;
                    fillSquare(context, previousSquare.x, previousSquare.y, xPos, yPos, "unhover");
                    fillSquare(context, mousePos.x, mousePos.y, xPos, yPos, "hover");
                }
            } else {
                canvas.style.cursor = "crosshair";
            }
        }, false);
    }

}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}