/**
 * Created by murphyjp on 12/23/2016.
 */

var canvas,
    context,
    WIDTH,
    HEIGHT,
    paused = true,
    status = 0,
    stats = false,
    dimOffset = 0;

// var mx = 0,
//     my = 0;

var charX = 100,
    charY = 200,
    yOffset = 80;

var images = {},
    totalImages = 33,
    nImagesLoaded = 0;

var fps = 45,
    intervalTimer;

var jumping = false,
    jumpHangTime = 500,
    jumpHeight = 150,
    jumpOffset = 0;

var speed = 0,
    accel = 1,
    facing = 1,
    isMoving = false,
    maxSpeed = 10,
    moveInterval,
    isHurt = false,
    lives = 4,
    fruits = 0;

var apple1X = 0,
    apple2X = 0,
    apple3X = 0,
    lemonX = 0,
    melonX = 0,
    apple1Y = 0,
    apple2Y = 0,
    apple3Y = 0,
    lemonY = 0,
    melonY = 0,
    apple1Speed = 0,
    apple2Speed = 0,
    apple3Speed = 0,
    lemonSpeed = 0,
    melonSpeed = 0,
    apple1Caught = false,
    apple2Caught = false,
    apple3Caught = false,
    lemonCaught = false,
    melonCaught = false,
    fruitSpawner = 0,
    fruitThreshold = fps * 4; //4 seconds

var dinoMaxEyeHeight = 8,
    facingRex = 0,
    rexX = -250,
    rexY = charY - 62,
    rexEyeHeight = dinoMaxEyeHeight,
    rexEyeTime = 0,
    rexSpeed = 6,
    facingBronto = 0,
    brontoX = -250,
    brontoY = charY - 91,
    brontoEyeHeight = dinoMaxEyeHeight,
    brontoEyeTime = 0,
    brontoSpeed = 2,
    facingStegy = 0,
    stegyX = -250,
    stegyY = charY - 46,
    stegyEyeHeight = dinoMaxEyeHeight,
    stegyEyeTime = 0,
    stegySpeed = 4,
    facingTrice = 0,
    triceX = -250,
    triceY = charY - 26,
    triceEyeHeight = dinoMaxEyeHeight,
    triceEyeTime = 0,
    triceSpeed = 3,
    dinoSpawner = 0,
    dinoThreshold = fps * 2; //2 seconds

var breathInc = 0.1,
    breathMax = 1.0,
    breathDir = -1.0,
    breathPause = 30, //pause for n frames
    breathPauseCounter = 0,
    breathAmt = breathMax,
    breathInterval;

var maxEyeHeight = 14,
    curEyeHeight = maxEyeHeight,
    eyeOpenTime = 0,
    timeBtwBlinks = 4000,
    blinkUpdateTime = 200,
    blinkInterval;

var mouthSmile = [0, 0, 20, 0, 18, 2, 12, 6, 8, 6, 2, 2],
    mouthJumping = [0, 0, 20, 0, 18, 2, 12, 4, 8, 4, 2, 2],
    mouthFrown = [0, 0, 6, -2, 14, -2, 20, 0, 18, 4, 14, 1, 6, 1, 2, 4];


// Initialize the canvas on the page
function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth - dimOffset;
    canvas.height = window.innerHeight - dimOffset;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    document.getElementById('startTitle').style.left = parseInt(WIDTH / 2 - 150) + "px";
    canvas.onselectstart = function () {
        return false;
    }; //disallows double-click highlighting
    charY = HEIGHT - yOffset;
    rexY = charY - 62;
    brontoY = charY - 91;
    stegyY = charY - 46;
    triceY = charY - 26;

    loadImage("hair");
    loadImage("head");
    loadImage("body");
    loadImage("leftArm");
    loadImage("legs");
    loadImage("rightArm");
    loadImage("leftArm-jump");
    loadImage("legs-jump");
    loadImage("rightArm-jump");
    loadImage("hair-l");
    loadImage("head-l");
    loadImage("body-l");
    loadImage("leftArm-l");
    loadImage("legs-l");
    loadImage("rightArm-l");
    loadImage("leftArm-jump-l");
    loadImage("legs-jump-l");
    loadImage("rightArm-jump-l");
    loadImage("rex");
    loadImage("rex-r");
    loadImage("bronto");
    loadImage("bronto-r");
    loadImage("stegy");
    loadImage("stegy-r");
    loadImage("trice");
    loadImage("trice-r");
    loadImage("life1");
    loadImage("life2");
    loadImage("life3");
    loadImage("life4");
    loadImage("apple");
    loadImage("lemon");
    loadImage("melon");

    //add events here
    // document.addEventListener('click',function (e) {iClick(e);});
    document.addEventListener('keydown', function (e) {
        handleKeyDown(e);
    });
    document.addEventListener('keyup', function (e) {
        handleKeyUp(e);
    });

    moveInterval = setInterval(updateMove, 1000 / fps); //start moving
    breathInterval = setInterval(updateBreath, 1000 / fps); //start breathing
    blinkInterval = setInterval(updateBlink, blinkUpdateTime); //start blinking
}

// Resets canvas size on window resize.
function handleResize() {
    canvas.width = window.innerWidth - dimOffset;
    canvas.height = window.innerHeight - dimOffset;
    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    charY = HEIGHT - yOffset;
    clearInterval(intervalTimer);
    intervalTimer = setInterval(draw, 1000 / fps);
}

// Actually draws the images to the canvas
function draw() {
    canvas.width = canvas.width; // clears the canvas

    //draw horizon
    context.beginPath();
    context.moveTo(0, charY + 15);
    context.lineTo(WIDTH, charY + 15);
    context.stroke();

    //draw dinos
    drawRex();
    drawBronto();
    drawStegy();
    drawTrice();

    drawLives();
    drawFruitsCounter();

    //draw character
    if (lives > 0) {
        if (facing == 1) {
            drawCharacterRight();
        } else {
            drawCharacterLeft();
        }
    } else { //game over
        if (fruits >= 50){
            var winBanner = document.getElementById('win');
            winBanner.style.left = parseInt(WIDTH / 2 - 150) + "px";
            winBanner.style.display = 'block';
        }else {
            charX = -500;
            var gameOverBanner = document.getElementById('gameOver');
            gameOverBanner.style.left = parseInt(WIDTH / 2 - 150) + "px";
            gameOverBanner.style.display = 'block';
        }
    }

    var pausedBanner = document.getElementById('paused');
    var startBanner = document.getElementById('start');
    if (status == 0){
        startBanner.style.left = parseInt(WIDTH / 2 - 150) + "px";
        startBanner.style.display = 'block';
    }else{
        if (paused) {
            pausedBanner.style.left = parseInt(WIDTH / 2 - 150) + "px";
            pausedBanner.style.display = 'block';
        } else {
            pausedBanner.style.display = 'none';
        }
    }

    drawFruit();
}

//Draws fruit
function drawFruit() {
    if (apple1X > 0) {
        if (apple1Caught) {
            context.save();
            context.globalAlpha = 0.6;
        }
        context.drawImage(images["apple"], apple1X, apple1Y);
        if (apple1Caught) {
            context.restore();
        }
    }
    if (apple2X > 0) {
        if (apple2Caught) {
            context.save();
            context.globalAlpha = 0.6;
        }
        context.drawImage(images["apple"], apple2X, apple2Y);
        if (apple2Caught) {
            context.restore();
        }
    }
    if (apple3X > 0) {
        if (apple3Caught) {
            context.save();
            context.globalAlpha = 0.6;
        }
        context.drawImage(images["apple"], apple3X, apple3Y);
        if (apple3Caught) {
            context.restore();
        }
    }
    if (melonX > 0) {
        if (melonCaught) {
            context.save();
            context.globalAlpha = 0.6;
        }
        context.drawImage(images["melon"], melonX, melonY);
        if (melonCaught) {
            context.restore();
        }
    }
    if (lemonX > 0) {
        if (lemonCaught) {
            context.save();
            context.globalAlpha = 0.6;
        }
        context.drawImage(images["lemon"], lemonX, lemonY);
        if (lemonCaught) {
            context.restore();
        }
    }
}

//Draws dinos
function drawRex() {
    if (facingRex == 1) {
        drawEllipse(rexX + 40, charY + 29, 80, 5); //shadow
        context.drawImage(images["rex-r"], rexX, rexY);
        drawEllipse(rexX + 23, charY - 54, 6, rexEyeHeight); // Left Eye
        drawEllipse(rexX + 30, charY - 54, 6, rexEyeHeight); // Right Eye
    } else if (facingRex == -1) {
        drawEllipse(rexX + 40, charY + 29, 80, 5); //shadow
        context.drawImage(images["rex"], rexX, rexY);
        drawEllipse(rexX + 23, charY - 54, 6, rexEyeHeight); // Left Eye
        drawEllipse(rexX + 30, charY - 54, 6, rexEyeHeight); // Right Eye
    }
}
function drawBronto() {
    if (facingBronto == 1) {
        drawEllipse(brontoX + 55, charY + 29, 120, 5); //shadow
        context.drawImage(images["bronto-r"], brontoX, brontoY);
        drawEllipse(brontoX + 19, charY - 82, 6, brontoEyeHeight); // Left Eye
        drawEllipse(brontoX + 26, charY - 82, 6, brontoEyeHeight); // Right Eye
    } else if (facingBronto == -1) {
        drawEllipse(brontoX + 55, charY + 29, 120, 5); //shadow
        context.drawImage(images["bronto"], brontoX, brontoY);
        drawEllipse(brontoX + 19, brontoY + 11, 6, brontoEyeHeight); // Left Eye
        drawEllipse(brontoX + 26, brontoY + 11, 6, brontoEyeHeight); // Right Eye
    }
}
function drawStegy() {
    if (facingStegy == 1) {
        drawEllipse(stegyX + 85, charY + 29, 155, 5); //shadow
        context.drawImage(images["stegy-r"], stegyX, stegyY);
        drawEllipse(stegyX + 15, stegyY + 18, 6, stegyEyeHeight); // Left Eye
        drawEllipse(stegyX + 22, stegyY + 18, 6, stegyEyeHeight); // Right Eye
    } else if (facingStegy == -1) {
        drawEllipse(stegyX + 85, charY + 29, 155, 5); //shadow
        context.drawImage(images["stegy"], stegyX, stegyY);
        drawEllipse(stegyX + 15, stegyY + 18, 6, stegyEyeHeight); // Left Eye
        drawEllipse(stegyX + 22, stegyY + 18, 6, stegyEyeHeight); // Right Eye
    }
}
function drawTrice() {
    if (facingTrice == 1) {
        drawEllipse(triceX + 55, charY + 29, 110, 5); //shadow
        context.drawImage(images["trice-r"], triceX, triceY);
        drawEllipse(triceX + 15, triceY + 24, 6, triceEyeHeight); // Left Eye
        drawEllipse(triceX + 22, triceY + 24, 6, triceEyeHeight); // Right Eye
    } else if (facingTrice == -1) {
        drawEllipse(triceX + 55, charY + 29, 110, 5); //shadow
        context.drawImage(images["trice"], triceX, triceY);
        drawEllipse(triceX + 15, triceY + 24, 6, triceEyeHeight); // Left Eye
        drawEllipse(triceX + 22, triceY + 24, 6, triceEyeHeight); // Right Eye
    }
}

//Draws character
function drawCharacterRight() {
    if (isHurt % 10 >= 5) {
        context.save();
        context.globalAlpha = 0.6;
    }
    if (jumping || jumpOffset > 0) {
        drawEllipse(charX + 40, charY + 29, 120 + breathAmt - parseInt(jumpOffset / 5), 4); //shadow
        context.drawImage(images["leftArm-jump"], charX + 40, charY - 42 + breathAmt - jumpOffset);
        context.drawImage(images["legs-jump"], charX, charY - 6 - jumpOffset);
    } else {
        drawEllipse(charX + 40, charY + 29, 160 + breathAmt, 6); //shadow
        context.drawImage(images["leftArm"], charX + 40, charY - 42 + breathAmt - jumpOffset);
        context.drawImage(images["legs"], charX, charY - jumpOffset);
    }
    context.drawImage(images["body"], charX, charY - 50 - jumpOffset);
    context.drawImage(images["head"], charX - 10, charY - 125 + breathAmt - jumpOffset);
    context.drawImage(images["hair"], charX - 27, charY - 138 + breathAmt - jumpOffset);
    if (jumping || jumpOffset > 0) {
        context.drawImage(images["rightArm-jump"], charX - 35, charY - 42 + breathAmt - jumpOffset);
    } else {
        context.drawImage(images["rightArm"], charX - 15, charY - 42 + breathAmt - jumpOffset);
    }
    if (isHurt > 0) {
        drawMouth(charX + 42, charY - 50 + breathAmt - jumpOffset, mouthFrown);
    } else {
        if (jumping) {
            drawMouth(charX + 42, charY - 50 + breathAmt - jumpOffset, mouthJumping);
        } else {
            drawMouth(charX + 42, charY - 50 + breathAmt - jumpOffset, mouthSmile);
        }
    }
    drawEllipse(charX + 47, charY - 68 + breathAmt - jumpOffset, 8, curEyeHeight); // Left Eye
    drawEllipse(charX + 58, charY - 68 + breathAmt - jumpOffset, 8, curEyeHeight); // Right Eye

    if (isHurt % 10 >= 5) {
        context.restore();
    }
}
function drawCharacterLeft() {
    if (isHurt % 10 >= 5) {
        context.save();
        context.globalAlpha = 0.6;
    }
    if (jumping || jumpOffset > 0) {
        drawEllipse(charX + 40, charY + 29, 120 + breathAmt - parseInt(jumpOffset / 5), 4); //shadow
        context.drawImage(images["leftArm-jump-l"], charX - 10, charY - 42 + breathAmt - jumpOffset);
        context.drawImage(images["legs-jump-l"], charX - 7, charY - 6 - jumpOffset);
    } else {
        drawEllipse(charX + 40, charY + 29, 160 + breathAmt, 6); //shadow
        context.drawImage(images["leftArm-l"], charX - 10, charY - 42 + breathAmt - jumpOffset);
        context.drawImage(images["legs-l"], charX, charY - jumpOffset);
    }
    context.drawImage(images["body-l"], charX + 25, charY - 50 - jumpOffset);
    context.drawImage(images["head-l"], charX + 10, charY - 125 + breathAmt - jumpOffset);
    context.drawImage(images["hair-l"], charX + 7, charY - 138 + breathAmt - jumpOffset);
    if (jumping || jumpOffset > 0) {
        context.drawImage(images["rightArm-jump-l"], charX + 72, charY - 42 + breathAmt - jumpOffset);
    } else {
        context.drawImage(images["rightArm-l"], charX + 68, charY - 42 + breathAmt - jumpOffset);
    }
    if (isHurt > 0) {
        drawMouth(charX + 28, charY - 50 + breathAmt - jumpOffset, mouthFrown);
    } else {
        if (jumping) {
            drawMouth(charX + 28, charY - 50 + breathAmt - jumpOffset, mouthJumping);
        } else {
            drawMouth(charX + 28, charY - 50 + breathAmt - jumpOffset, mouthSmile);
        }
    }
    drawEllipse(charX + 33, charY - 68 + breathAmt - jumpOffset, 8, curEyeHeight); // Left Eye
    drawEllipse(charX + 44, charY - 68 + breathAmt - jumpOffset, 8, curEyeHeight); // Right Eye

    if (isHurt % 10 >= 5) {
        context.restore();
    }
}

//Draws lives & fruit counter
function drawLives() {
    if (lives > 0) {
        if (isHurt % 10 >= 5 && lives == 1) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(20, HEIGHT - 35);
        if (isHurt % 10 >= 5 && lives == 1) {
            context.restore();
        }
    }
    if (lives > 1) {
        if (isHurt % 10 >= 5 && lives == 2) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(40, HEIGHT - 35);
        if (isHurt % 10 >= 5 && lives == 2) {
            context.restore();
        }
    }
    if (lives > 2) {
        if (isHurt % 10 >= 5 && lives == 3) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(60, HEIGHT - 35);
        if (isHurt % 10 >= 5 && lives == 3) {
            context.restore();
        }
    }
    if (lives > 3) {
        if (isHurt % 10 >= 5 && lives == 4) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(80, HEIGHT - 35);
        if (isHurt % 10 >= 5 && lives == 4) {
            context.restore();
        }
    }
}
function drawFruitsCounter() {
    for (var i = 0; i < fruits; i++) {
        context.beginPath();
        context.arc(i * 25 + 150, HEIGHT - 28, 9, 0, Math.PI * 2);
        context.fillStyle = '#222222';
        context.fill();
    }
    var label = document.getElementById("fruitsLabel");
    label.innerHTML = fruits + "";
    label.style.top = (HEIGHT - 40) + "px";
    label.style.left = (fruits * 25 + 140) + "px";
}

//Decides when to spawn a Fruit
function spawnFruit() {
    var r;
    r = Math.floor(Math.random() * 5);
    fruitSpawner += r;
    if (fruitSpawner >= fruitThreshold) {
        fruitSpawner = 0;
        r = Math.floor(Math.random() * 3);
        switch (r) {
            case 0:
                spawnApple();
                break;
            case 1:
                spawnLemon();
                break;
            case 2:
                spawnMelon();
                break;
        }
    }
}

//spawns fruit
function spawnApple() {
    var rx = Math.floor(Math.random() * (WIDTH - 200) + 100);
    var rs = Math.floor(Math.random() * 4 + 2);
    if (apple1X == 0) {
        apple1X = rx;
        apple1Y = -50;
        apple1Speed = rs;
    } else if (apple2X == 0) {
        apple2X = rx;
        apple2Y = -50;
        apple2Speed = rs;
    } else if (apple3X == 0) {
        apple3X = rx;
        apple3Y = -50;
        apple3Speed = rs;
    }
}
function spawnLemon() {
    var rx = Math.floor(Math.random() * (WIDTH - 200) + 100);
    var rs = Math.floor(Math.random() * 4 + 2);
    if (lemonX == 0) {
        lemonX = rx;
        lemonY = -50;
        lemonSpeed = rs;
    }
}
function spawnMelon() {
    var rx = Math.floor(Math.random() * (WIDTH - 200) + 100);
    var rs = Math.floor(Math.random() * 4 + 2);
    if (melonX == 0) {
        melonX = rx;
        melonY = -50;
        melonSpeed = rs;
    }
}

//Decides when to spawn a Dino
function spawnDino() {
    var r;
    r = Math.floor(Math.random() * 5);
    dinoSpawner += r;
    if (dinoSpawner >= dinoThreshold) {
        dinoSpawner = 0;
        r = Math.floor(Math.random() * 4);
        switch (r) {
            case 0:
                spawnRex();
                break;
            case 1:
                spawnBronto();
                break;
            case 2:
                spawnStegy();
                break;
            case 3:
                spawnTrice();
                break;
        }
    }
}

//spawns dinos
function spawnRex() {
    if (facingRex == 0) {
        facingRex = -1;
        rexX = WIDTH;
    }
}
function spawnBronto() {
    if (facingBronto == 0) {
        facingBronto = -1;
        brontoX = WIDTH;
    }
}
function spawnStegy() {
    if (facingStegy == 0) {
        facingStegy = -1;
        stegyX = WIDTH;
    }
}
function spawnTrice() {
    if (facingTrice == 0) {
        facingTrice = -1;
        triceX = WIDTH;
    }
}

//removes fruit when caught
function removeApple1() {
    apple1X = 0;
    apple1Caught = false;
}
function removeApple2() {
    apple2X = 0;
    apple2Caught = false;
}
function removeApple3() {
    apple3X = 0;
    apple3Caught = false;
}
function removeLemon() {
    lemonX = 0;
    lemonCaught = false;
}
function removeMelon() {
    melonX = 0;
    melonCaught = false;
}

// Moves all elements (looped with moveInterval))
function updateMove() {
    if (!paused) {
        if (isMoving) {
            move();
        }
        if (jumping && jumpOffset < jumpHeight) {
            jumpOffset += parseInt(((jumpHeight - jumpOffset) / 4) + 2);
        }
        if (!jumping && jumpOffset > 0) {
            jumpOffset -= parseInt((jumpOffset / 3) + 2);
        }
        if (jumpOffset > jumpHeight) {
            jumpOffset = jumpHeight;
        }
        if (jumpOffset < 0) {
            jumpOffset = 0;
        }

        if (apple1X > 0) {
            if (apple1Caught) {
                apple1Y -= 1;
            } else {
                apple1Y += apple1Speed;
            }
            if (apple1Y >= HEIGHT) {
                apple1X = 0;
            }
        }
        if (apple2X > 0) {
            if (apple2Caught) {
                apple2Y -= 1;
            } else {
                apple2Y += apple2Speed;
            }
            if (apple2Y >= HEIGHT) {
                apple2X = 0;
            }
        }
        if (apple3X > 0) {
            if (apple3Caught) {
                apple3Y -= 1;
            } else {
                apple3Y += apple3Speed;
            }
            if (apple3Y >= HEIGHT) {
                apple3X = 0;
            }
        }
        if (lemonX > 0) {
            if (lemonCaught) {
                lemonY -= 1;
            } else {
                lemonY += lemonSpeed;
            }
            if (lemonY >= HEIGHT) {
                lemonX = 0;
            }
        }
        if (melonX > 0) {
            if (melonCaught) {
                melonY -= 1;
            } else {
                melonY += melonSpeed;
            }
            if (melonY >= HEIGHT) {
                melonX = 0;
            }
        }

        if (facingRex != 0) {
            rexX -= rexSpeed;
            if (rexX <= -100) {
                facingRex = 0;
            }
        }
        if (facingBronto != 0) {
            brontoX -= brontoSpeed;
            if (brontoX <= -150) {
                facingBronto = 0;
            }
        }
        if (facingStegy != 0) {
            stegyX -= stegySpeed;
            if (stegyX <= -200) {
                facingStegy = 0;
            }
        }
        if (facingTrice != 0) {
            triceX -= triceSpeed;
            if (triceX <= -100) {
                facingTrice = 0;
            }
        }

        collisionCheck();
        spawnDino();
        spawnFruit();

        recordStats();
    }
}

// Moves character
function move() {
    if (!paused) {
        if (speed < maxSpeed) {
            speed += accel;
        }
        charX += facing * speed;

        if (charX <= 20) {
            charX = 20;
        }
        if (charX >= (WIDTH - 105)) {
            charX = (WIDTH - 105);
        }
    }
}

// Checks collisions between player and dinos/fruits
function collisionCheck() {
    var rexXc = charX - rexX,
        rexYc = charY - rexY - jumpOffset,
        brontoXc = charX - brontoX,
        brontoYc = charY - brontoY - jumpOffset,
        stegyXc = charX - stegyX,
        stegyYc = charY - stegyY - jumpOffset,
        triceXc = charX - triceX,
        triceYc = charY - triceY - jumpOffset,
        apple1Xc = charX - apple1X,
        apple1Yc = charY - apple1Y - jumpOffset,
        apple2Xc = charX - apple2X,
        apple2Yc = charY - apple2Y - jumpOffset,
        apple3Xc = charX - apple3X,
        apple3Yc = charY - apple3Y - jumpOffset,
        melonXc = charX - melonX,
        melonYc = charY - melonY - jumpOffset,
        lemonXc = charX - lemonX,
        lemonYc = charY - lemonY - jumpOffset;
    var collisionWithDino = false;

    if (rexXc > -78 && rexXc < 100 && rexYc < 245 && rexYc > -29 && !isHurt) {
        collisionWithDino = true; //collision with rex
    }
    if (brontoXc > -74 && brontoXc < 62 && brontoYc < 185 && brontoYc > -29 && !isHurt) {
        collisionWithDino = true; //collision with bronto
    }
    if (stegyXc > -54 && stegyXc < 143 && stegyYc < 200 && stegyYc > -29 && !isHurt) {
        collisionWithDino = true; //collision with stegy
    }
    if (triceXc > -74 && triceXc < 90 && triceYc < 180 && triceYc > -29 && !isHurt) {
        collisionWithDino = true; //collision with trice
    }


    if (collisionWithDino) {
        isHurt = parseInt(fps * 1.5);
    }
    if (apple1Xc > -94 && apple1Xc < 56 && apple1Yc > -29 && apple1Yc < 183 && !apple1Caught) {
        apple1Caught = true;
        fruits++;
        setTimeout(removeApple1, 1000);
    }
    if (apple2Xc > -94 && apple2Xc < 56 && apple2Yc > -29 && apple2Yc < 183 && !apple2Caught) {
        apple2Caught = true;
        fruits++;
        setTimeout(removeApple2, 1000);
    }
    if (apple3Xc > -94 && apple3Xc < 56 && apple3Yc > -29 && apple3Yc < 183 && !apple3Caught) {
        apple3Caught = true;
        fruits++;
        setTimeout(removeApple3, 1000);
    }
    if (melonXc > -94 && melonXc < 86 && melonYc > -29 && melonYc < 175 && !melonCaught) {
        melonCaught = true;
        fruits += 2;
        setTimeout(removeMelon, 1000);
    }
    if (lemonXc > -94 && lemonXc < 56 && lemonYc > -29 && lemonYc < 169 && !lemonCaught) {
        lemonCaught = true;
        fruits -= 2;
        setTimeout(removeLemon, 1000);
    }
    if (fruits < 0) {
        fruits = 0;
    }
    if (fruits > 50) {
        fruits = 50;
        lives = 0;
    }

    if (isHurt > 1) {
        isHurt -= 1;
    }
    if (isHurt == 1) {
        lives--;
        isHurt = 0;
    }
}

// Handles character's jumping
function jump() {
    if (!paused) {
        if (!jumping) {
            jumping = true;
            setTimeout(land, jumpHangTime);
        }
    }
}

// Handles character's landing from a jump
function land() {
    jumping = false;
}

// Handles character's breathing
function updateBreath() {
    if (breathPauseCounter === 0) {
        if (breathDir === -1) {  // breath in
            breathAmt -= breathInc;
            if (breathAmt < -breathMax) {
                breathDir = 1;
            }
        } else {  // breath out
            breathAmt += breathInc / 2;
            if (breathAmt > breathMax) {
                breathDir = -1;
                breathPauseCounter = breathPause;
            }
        }
    } else {
        breathPauseCounter -= 1;
    }
}

// Determines when character & dinos should blink
function updateBlink() {
    eyeOpenTime += blinkUpdateTime;
    if (facingRex != 0) {
        rexEyeTime += blinkUpdateTime;
    }
    if (facingBronto != 0) {
        brontoEyeTime += blinkUpdateTime;
    }
    if (facingStegy != 0) {
        stegyEyeTime += blinkUpdateTime;
    }
    if (facingTrice != 0) {
        triceEyeTime += blinkUpdateTime;
    }

    if (eyeOpenTime >= timeBtwBlinks) {
        blink();
    }
    if (facingRex != 0 && rexEyeTime >= timeBtwBlinks) {
        rexBlink();
    }
    if (facingBronto != 0 && brontoEyeTime >= timeBtwBlinks) {
        brontoBlink();
    }
    if (facingStegy != 0 && stegyEyeTime >= timeBtwBlinks) {
        stegyBlink();
    }
    if (facingTrice != 0 && triceEyeTime >= timeBtwBlinks) {
        triceBlink();
    }
}

// Handles character's blinking
function blink() {
    curEyeHeight -= 1;
    if (curEyeHeight <= 0) {
        eyeOpenTime = 0;
        curEyeHeight = maxEyeHeight;
    } else {
        setTimeout(blink, 10);
    }
}

// Handles Rex's blinking
function rexBlink() {
    rexEyeHeight -= 1;
    if (rexEyeHeight <= 0) {
        rexEyeTime = 0;
        rexEyeHeight = dinoMaxEyeHeight;
    } else {
        setTimeout(rexBlink, 10);
    }
}

// Handles Bronto's blinking
function brontoBlink() {
    brontoEyeHeight -= 1;
    if (brontoEyeHeight <= 0) {
        brontoEyeTime = 0;
        brontoEyeHeight = dinoMaxEyeHeight;
    } else {
        setTimeout(brontoBlink, 10);
    }
}

// Handles Stegy's blinking
function stegyBlink() {
    stegyEyeHeight -= 1;
    if (stegyEyeHeight <= 0) {
        stegyEyeTime = 0;
        stegyEyeHeight = dinoMaxEyeHeight;
    } else {
        setTimeout(stegyBlink, 10);
    }
}

// Handles Trice's blinking
function triceBlink() {
    triceEyeHeight -= 1;
    if (triceEyeHeight <= 0) {
        triceEyeTime = 0;
        triceEyeHeight = dinoMaxEyeHeight;
    } else {
        setTimeout(triceBlink, 10);
    }
}

// Draws mouth
function drawMouth(x, y, mouth) {
    var i, n;
    n = mouth.length;
    if (n <= 0 || n % 2 != 0) {
        return;
    } //if invalid coordinates, do nothing

    context.beginPath();
    context.moveTo(mouth[0] + x, mouth[1] + y);
    for (i = 2; i < n; i += 2) {
        context.lineTo(mouth[i] + x, mouth[i + 1] + y);
    }
    context.lineTo(mouth[0] + x, mouth[1] + y);

    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

// Draws life symbol
function drawLifeSymbol(x, y) {
    var shape = [8, 0, 18, 0, 13, 6, 16, 7, 7, 18, 8, 10, 4, 10, 8, 0];
    var i, n;
    n = shape.length;

    context.beginPath();
    context.moveTo(shape[0] + x, shape[1] + y);
    for (i = 2; i < n; i += 2) {
        context.lineTo(shape[i] + x, shape[i + 1] + y);
    }
    context.lineTo(shape[0] + x, shape[1] + y);

    context.fillStyle = "#222222";
    context.fill();
    context.closePath();
}

// Draws ellipse (for eyes ;)
function drawEllipse(centerX, centerY, width, height) {

    context.beginPath();

    context.moveTo(centerX, centerY - height / 2);

    context.bezierCurveTo(
        centerX + width / 2, centerY - height / 2,
        centerX + width / 2, centerY + height / 2,
        centerX, centerY + height / 2);

    context.bezierCurveTo(
        centerX - width / 2, centerY + height / 2,
        centerX - width / 2, centerY - height / 2,
        centerX, centerY - height / 2);

    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

// Loads image
function loadImage(name) {
    images[name] = new Image();
    images[name].onload = function () {
        resourceLoaded();
    };
    images[name].src = "imgs/" + name + ".png";
}

// Counts images to ensure all are loaded before drawing, then starts drawing loop.
function resourceLoaded() {
    nImagesLoaded += 1;
    if (nImagesLoaded === totalImages) {
        intervalTimer = setInterval(draw, 1000 / fps);
    }
}

// Outputs stats to the screen, if selected
function recordStats() {
    if (stats) {
        document.getElementById('charX').innerHTML = charX + "";
        document.getElementById('charY').innerHTML = (charY - jumpOffset) + "";
        document.getElementById('rexX').innerHTML = rexX + "";
        document.getElementById('rexY').innerHTML = rexY + "";
        document.getElementById('brontoX').innerHTML = brontoX + "";
        document.getElementById('brontoY').innerHTML = brontoY + "";
        document.getElementById('stegyX').innerHTML = stegyX + "";
        document.getElementById('stegyY').innerHTML = stegyY + "";
        document.getElementById('triceX').innerHTML = triceX + "";
        document.getElementById('triceY').innerHTML = triceY + "";
        document.getElementById('apple1X').innerHTML = apple1X + "";
        document.getElementById('apple1Y').innerHTML = apple1Y + "";
        document.getElementById('apple2X').innerHTML = apple2X + "";
        document.getElementById('apple2Y').innerHTML = apple2Y + "";
        document.getElementById('apple3X').innerHTML = apple3X + "";
        document.getElementById('apple3Y').innerHTML = apple3Y + "";
        document.getElementById('melonX').innerHTML = melonX + "";
        document.getElementById('melonY').innerHTML = melonY + "";
        document.getElementById('lemonX').innerHTML = lemonX + "";
        document.getElementById('lemonY').innerHTML = lemonY + "";
        document.getElementById('stats').style.display = 'block';
    } else {
        document.getElementById('stats').style.display = 'none';
    }
}

//Mouse click!
// function iClick(e){
//     getMouse(e);
//     jump();
// }
// Gets mouse data
// function getMouse(e) {
//     var element = canvas,
//         offsetX = 0,
//         offsetY = 0;
//
//     if (element.offsetParent) { //get offset of canvas to all ancestors
//         do {
//             offsetX += element.offsetLeft;
//             offsetY += element.offsetTop;
//         } while ((element = element.offsetParent));
//     }
//
//     mx = e.pageX - offsetX;
//     my = e.pageY - offsetY;
// }

//Handles pause toggle
function togglePause() {
    if (status == 0){
        document.getElementById('startTitle').style.display = 'none';
        document.getElementById('start').style.display = 'none';
        status = 1;
        paused = false;
    }else {
        if (lives > 0) {
            paused = !paused;
        }
    }
}

//Handles stats toggle
function toggleStats() {
    stats = !stats;
}

// Handles keydown events
function handleKeyDown(e) {
    var key = e.which || e.keyCode;
    switch (key) {
        case 32: //space
            jump();
            break;
        case 37: //left
        case 65: //a
            facing = -1;
            isMoving = true;
            move();
            break;
        case 39: //right
        case 68: //d
            facing = 1;
            isMoving = true;
            move();
            break;
        case 38: //up
        case 87: //w
            jump();
            break;
        case 40: //down
            break;
        case 83: //s
            toggleStats();
            break;
        case 80: //p
            togglePause();
            break;
        case 13: //enter
        case 16: //right shift
            if (lives == 0) {
                location.reload();
            }
            break;
    }
}

// Handles keyup events
function handleKeyUp(e) {
    var key = e.which || e.keyCode;
    switch (key) {
        case 32: //space
            break;
        case 37: //left
        case 65: //a
            isMoving = false;
            speed = 0;
            break;
        case 39: //right
        case 68: //d
            isMoving = false;
            speed = 0;
            break;
        case 38: //up
        case 87: //w
            break;
        case 40: //down
        case 83: //s
            break;
        case 80: //p
            //pause
            break;
        case 13: //enter
        case 16: //right shift
            //fire
            break;
    }
}