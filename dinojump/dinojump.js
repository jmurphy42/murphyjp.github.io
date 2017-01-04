/**
 * Created by murphyjp on 12/23/2016.
 */

var canvas,
    context,
    WIDTH,
    HEIGHT,
    paused = true;
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
    collisionThreshold = 25,
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
    rexX = -50,
    rexEyeHeight = dinoMaxEyeHeight,
    rexEyeTime = 0,
    rexSpeed = 6,
    facingBronto = 0,
    brontoX = -50,
    brontoEyeHeight = dinoMaxEyeHeight,
    brontoEyeTime = 0,
    brontoSpeed = 2,
    facingStegy = 0,
    stegyX = -50,
    stegyEyeHeight = dinoMaxEyeHeight,
    stegyEyeTime = 0,
    stegySpeed = 4,
    facingTrice = 0,
    triceX = -50,
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
    canvas.onselectstart = function () {
        return false;
    }; //disallows double-click highlighting
    charY = HEIGHT - yOffset;

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
    } else {
        var gameOverBanner = document.getElementById('gameOver');
        gameOverBanner.style.left = parseInt(WIDTH / 2 - 150) + "px";
        gameOverBanner.style.display = 'block';
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
        context.drawImage(images["rex-r"], rexX, charY - 62);
        drawEllipse(rexX + 23, charY - 54, 6, rexEyeHeight); // Left Eye
        drawEllipse(rexX + 30, charY - 54, 6, rexEyeHeight); // Right Eye
    } else if (facingRex == -1) {
        drawEllipse(rexX + 40, charY + 29, 80, 5); //shadow
        context.drawImage(images["rex"], rexX, charY - 62);
        drawEllipse(rexX + 23, charY - 54, 6, rexEyeHeight); // Left Eye
        drawEllipse(rexX + 30, charY - 54, 6, rexEyeHeight); // Right Eye
    }
}
function drawBronto() {
    if (facingBronto == 1) {
        drawEllipse(brontoX + 55, charY + 29, 120, 5); //shadow
        context.drawImage(images["bronto-r"], brontoX, charY - 91);
        drawEllipse(brontoX + 19, charY - 82, 6, brontoEyeHeight); // Left Eye
        drawEllipse(brontoX + 26, charY - 82, 6, brontoEyeHeight); // Right Eye
    } else if (facingBronto == -1) {
        drawEllipse(brontoX + 55, charY + 29, 120, 5); //shadow
        context.drawImage(images["bronto"], brontoX, charY - 91);
        drawEllipse(brontoX + 19, charY - 82, 6, brontoEyeHeight); // Left Eye
        drawEllipse(brontoX + 26, charY - 82, 6, brontoEyeHeight); // Right Eye
    }
}
function drawStegy() {
    if (facingStegy == 1) {
        drawEllipse(stegyX + 85, charY + 29, 155, 5); //shadow
        context.drawImage(images["stegy-r"], stegyX, charY - 46);
        drawEllipse(stegyX + 15, charY - 28, 6, stegyEyeHeight); // Left Eye
        drawEllipse(stegyX + 22, charY - 28, 6, stegyEyeHeight); // Right Eye
    } else if (facingStegy == -1) {
        drawEllipse(stegyX + 85, charY + 29, 155, 5); //shadow
        context.drawImage(images["stegy"], stegyX, charY - 46);
        drawEllipse(stegyX + 15, charY - 28, 6, stegyEyeHeight); // Left Eye
        drawEllipse(stegyX + 22, charY - 28, 6, stegyEyeHeight); // Right Eye
    }
}
function drawTrice() {
    if (facingTrice == 1) {
        drawEllipse(triceX + 55, charY + 29, 110, 5); //shadow
        context.drawImage(images["trice-r"], triceX, charY - 26);
        drawEllipse(triceX + 15, charY + 2, 6, triceEyeHeight); // Left Eye
        drawEllipse(triceX + 22, charY + 2, 6, triceEyeHeight); // Right Eye
    } else if (facingTrice == -1) {
        drawEllipse(triceX + 55, charY + 29, 110, 5); //shadow
        context.drawImage(images["trice"], triceX, charY - 26);
        drawEllipse(triceX + 15, charY + 2, 6, triceEyeHeight); // Left Eye
        drawEllipse(triceX + 22, charY + 2, 6, triceEyeHeight); // Right Eye
    }
}

//Draws character
function drawCharacterRight() {
    if (isHurt % 10 >= 5) {
        context.save();
        context.globalAlpha = 0.6;
    }
    if (jumping || jumpOffset>0) {
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
    if (jumping || jumpOffset>0) {
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
    if (jumping || jumpOffset>0) {
        drawEllipse(charX + 40, charY + 29, 120 + breathAmt - parseInt(jumpOffset / 5), 4); //shadow
        context.drawImage(images["leftArm-jump-l"], charX - 13, charY - 42 + breathAmt - jumpOffset);
        context.drawImage(images["legs-jump-l"], charX - 7, charY - 6 - jumpOffset);
    } else {
        drawEllipse(charX + 40, charY + 29, 160 + breathAmt, 6); //shadow
        context.drawImage(images["leftArm-l"], charX - 10, charY - 42 + breathAmt - jumpOffset);
        context.drawImage(images["legs-l"], charX, charY - jumpOffset);
    }
    context.drawImage(images["body-l"], charX + 25, charY - 50 - jumpOffset);
    context.drawImage(images["head-l"], charX + 10, charY - 125 + breathAmt - jumpOffset);
    context.drawImage(images["hair-l"], charX + 7, charY - 138 + breathAmt - jumpOffset);
    if (jumping || jumpOffset>0) {
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
        drawLifeSymbol(20,HEIGHT-35);
        if (isHurt % 10 >= 5 && lives == 1) {
            context.restore();
        }
    }
    if (lives > 1) {
        if (isHurt % 10 >= 5 && lives == 2) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(40,HEIGHT-35);
        if (isHurt % 10 >= 5 && lives == 2) {
            context.restore();
        }
    }
    if (lives > 2) {
        if (isHurt % 10 >= 5 && lives == 3) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(60,HEIGHT-35);
        if (isHurt % 10 >= 5 && lives == 3) {
            context.restore();
        }
    }
    if (lives > 3) {
        if (isHurt % 10 >= 5 && lives == 4) {
            context.save();
            context.globalAlpha = 0.6;
        }
        drawLifeSymbol(80,HEIGHT-35);
        if (isHurt % 10 >= 5 && lives == 4) {
            context.restore();
        }
    }
}
function drawFruitsCounter() {
    for (var i = 0; i < fruits; i++) {
        context.beginPath();
        context.arc(i * 25 + 120, HEIGHT - 28, 9, 0, Math.PI * 2);
        context.fillStyle = '#222222';
        context.fill();
    }
    var label = document.getElementById("fruitsLabel");
    label.innerHTML = fruits + "";
    label.style.top = (HEIGHT - 40) + "px";
    label.style.left = (fruits * 25 + 110) + "px";
}

// Decides when to spawn a Fruit
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

// Decides when to spawn a Dino
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
        if (jumping && jumpOffset == 0) {
            jumpOffset += parseInt((jumpHeight - jumpOffset) / 4) + 2;
        } else if (jumping && jumpOffset < jumpHeight) {
            jumpOffset *= 2;
        }
        if (!jumping && jumpOffset > 0) {
            jumpOffset -= parseInt((jumpOffset) / 3) + 2;
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
    }
}

// Moves character
function move() {
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

// Checks collisions between player and dinos/fruits
function collisionCheck() {
    if ((charX <= rexX + collisionThreshold && charX >= rexX - 2 * collisionThreshold && !jumping && !isHurt) ||
        (charX <= brontoX + collisionThreshold && charX >= brontoX - 2.5 * collisionThreshold && !jumping && !isHurt) ||
        (charX <= stegyX + collisionThreshold && charX >= stegyX - 3 * collisionThreshold && !jumping && !isHurt) ||
        (charX <= triceX + collisionThreshold && charX >= triceX - 2.5 * collisionThreshold && !jumping && !isHurt)) {

        isHurt = parseInt(fps * 1.5);
    }
    if (charX <= apple1X + collisionThreshold && charX >= apple1X - collisionThreshold &&
        apple1Y >= charY - 65 - jumpOffset && apple1Y <= charY - jumpOffset && !apple1Caught) {
        apple1Caught = true;
        fruits++;
        setTimeout(removeApple1, 1000);
    }
    if (charX <= apple2X + collisionThreshold && charX >= apple2X - collisionThreshold &&
        apple2Y >= charY - 65 - jumpOffset && apple2Y <= charY - jumpOffset && !apple2Caught) {
        apple2Caught = true;
        fruits++;
        setTimeout(removeApple2, 1000);
    }
    if (charX <= apple3X + collisionThreshold && charX >= apple3X - collisionThreshold &&
        apple3Y >= charY - 65 - jumpOffset && apple3Y <= charY - jumpOffset && !apple3Caught) {
        apple3Caught = true;
        fruits++;
        setTimeout(removeApple3, 1000);
    }
    if (charX <= melonX + 1.5 * collisionThreshold && charX >= melonX - 1.5 * collisionThreshold &&
        melonY >= charY - 65 - jumpOffset && melonY <= charY - jumpOffset && !melonCaught) {
        melonCaught = true;
        fruits += 2;
        setTimeout(removeMelon, 1000);
    }
    if (charX <= lemonX + collisionThreshold && charX >= lemonX - collisionThreshold &&
        lemonY >= charY - 65 - jumpOffset && lemonY <= charY - jumpOffset && !lemonCaught) {
        lemonCaught = true;
        fruits -= 2;
        setTimeout(removeLemon, 1000);
        if (fruits < 0) {
            fruits = 0;
        }
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
    if (!jumping) {
        jumping = true;
        setTimeout(land, jumpHangTime);
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
function drawLifeSymbol(x, y){
    var shape = [8,0,18,0,13,6,16,7,7,18,8,10,4,10,8,0];
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
function togglePause(){
    if (lives>0) {
        paused = !paused;
    }
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
        case 83: //s
            break;
        case 80: //p
            togglePause();
            break;
        case 13: //enter
        case 16: //right shift
            //fire
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