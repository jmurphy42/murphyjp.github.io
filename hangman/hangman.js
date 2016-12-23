/*
 * Created by Jason Murphy (murphyjp) on 12/13/2016.
 * Lab 4: jQuery-based Hangman game
 * SE2840 Web Application Development
 * MSOE, Dr. Jay Urbain
 */

/**
 * This file contains the jQuery and JavaScript code that implements the game logic.
 */

var words;
// var category = "8"; // 0 = all words
//                     // 1 = animals
//                     // 2 = occupations
//                     // 3 = foods
//                     // 4 = countries
//                     // 5 = general words
//                     // 6 = 8-letter general words
//                     // 7 = 10-letter general words
var myWhite = '#f5f5f5';
var myGreen= '#219225';
var myRed = '#ba2517';
var myYellow = '#caca17';
var currentLetterColor = myWhite;
var currentWord = "";
var incorrectGuesses = 0;
var wins = 0;
var losses = 0;
var loopedEvent;      //setInterval object, which blinks the win/loss banners
var blinkTime = 500;  //how long each blink takes, in milliseconds
var fadeLength = 500; //how long it takes for items to fade in
var wordsInit = false;
var wordOffset = 0;
var status = 0;

/**
 * onload: get words, then move on to initializing the game
 */
$(document).ready(function () {
    getWords("words/words0.txt");
    initLoop();
});

function initLoop(){
    if (wordsInit){
        initGame();
    }else{
        setTimeout(initLoop, 250);
    }
}

/**
 * Sets up UI and Game variables.
 * Attaches mouse listeners to various DOM elements.
 */
function initGame(){
    resetUI();
    resetGame();

    // Use jQuery to get elements
    var $letters = $(".alphabet td");
    var $resetButton = $("#reset");

    // Handle the mouseover event for letters in the alphabet
    // Highlight each letter in the alphabet yellow as the mouse passes over
    $letters.mouseover(function () {
        currentLetterColor = $(this).css('color');
        $(this).css('color', myYellow);
    });

    // Handle the mouseout event for letters in the alphabet
    // Turn the highlight off when the mouse leaves an alphabet letter, but be sure to change
    // it back to red, white, or green as appropriate.
    $letters.mouseout(function () {
        $(this).css('color', currentLetterColor);
    });

    // Handle the reset button event
    $resetButton.click(function () {
        if (status==0) {
            resetUI();
            resetGame();
        }

    });

    status = 1;
    toggleResetBtn();
}

function toggleResetBtn(){
    var $reset = $('#reset');
    if (status==0){ //not playing, turn button on
        $reset.animate({'opacity':'1'},250);
    }else{          //playing, disable button
        $reset.animate({'opacity':'0.2'},250);
    }
}

/**
 * Adds click functions to the letters
 */
function addClickFunctions() {
    var $letters = $(".alphabet td");
    $letters.click(function () {
        clickLetter(this);
    });
}

/**
 * Removes click functions from the letters
 */
function removeClickFunctions() {
    var $letters = $(".alphabet td");
    $letters.off('click');
}

/**
 * Handle mouse click events on the alphabet
 *    this is how the user guesses letters for the hidden word
 * @param letterClicked - the <td> in which the letter clicked is stored
 */
function clickLetter(letterClicked) {
    var letter = letterClicked.innerHTML;
    var letterCheck = checkLetter(letter);

    //remove EventListener for letter
    $('.alphabet td:contains(' + letter + ')').off('click');

    if (letterCheck.correct) { //correct guess
        letterClicked.style.color = myGreen;
        currentLetterColor = myGreen;

        for (var l = 0; l < currentWord.length; l++) {  //cycle through letters in word
            if (letterCheck.place[l] == 1) {            //if the letter is correct
                revealLetter(l, letter, myWhite);       //reveal the letter
            }
        }

        if (checkForWin()) {
            youWin();
        }

    } else { // incorrect guess
        letterClicked.style.color = myRed;
        currentLetterColor = myRed;

        //reveal piece of hangman
        var $images = $("div.image").children();
        $images.eq(incorrectGuesses+1).fadeIn(fadeLength);
        incorrectGuesses++;

        if (incorrectGuesses >= 6) {
            youLose();
        }
    }
}

/**
 * Handles the win condition
 * Blink the "You Win" message until the game is reset.
 * Increment the number of wins and update the title element.
 */
function youWin() {
    var winBanner = $("#win");
    blinkBanner(winBanner);
    $(".word td").css('color', myGreen);
    wins++;
    removeClickFunctions();
    updateStats();
    status = 0;
    toggleResetBtn();
    var $images = $("div.image").children();
    $images.eq(8).fadeIn(fadeLength);

}

/**
 * Handles the lose condition
 */
function youLose() {
    var lossBanner = $("#fail");
    blinkBanner(lossBanner);
    for (var n = 0; n < currentWord.length; n++) {
        var $letter = $(".word td").eq(n+wordOffset);
        if ($letter.html() == "?") {                       //if the letter is "?"
            revealLetter(n, currentWord.charAt(n), myRed); //reveal it
        }
    }
    losses++;
    removeClickFunctions();
    updateStats();
    status = 0;
    toggleResetBtn();
    var $images = $("div.image").children();
    $images.eq(7).fadeIn(fadeLength);

}

/**
 * Updates the stats with the current wins & losses
 */
function updateStats() {
    $('#wins').html(wins);
    $('#losses').html(losses);
}

/**
 * Blinks banner
 * @param banner - banner to blink
 */
function blinkBanner(banner) {
    loopedEvent = setInterval(function () {
        banner.css('visibility', 'visible');     //reveal win banner
        setTimeout(function () {
            banner.css('visibility', 'hidden');  //hide win banner
        }, parseInt(blinkTime * 2 / 3));
    }, blinkTime)
}

/**
 * Reveals letter
 * @param index  - index of letter
 * @param letter - letter to reveal
 * @param color  - color of letter to reveal
 */
function revealLetter(index, letter, color) {
    var letterCell = $(".word td").eq(index+wordOffset);
    letterCell.html(letter);             //write it here
    letterCell.css('color', color);
    letterCell.animate({'opacity': '1'}, fadeLength);
}

/**
 * Checks to see if the guessed letter is in the word
 * @param letter - the letter for which to check
 * @returns {{correct: boolean, place: Array}}
 *            correct: there is at least one correct letter
 *            place: the places to reveal the correct letter(s)
 */
function checkLetter(letter) {
    var correctPlace = [];
    var correctLetter = false;
    for (var l = 0; l < currentWord.length; l++) {
        if (currentWord.charAt(l) == letter) {
            correctPlace.push(1);
            correctLetter = true;
        } else {
            correctPlace.push(0);
        }
    }
    return {"correct": correctLetter, "place": correctPlace};
}

/**
 * Checks to see if all letters are guessed yet or not
 * @returns {boolean}
 */
function checkForWin() {
    var won = true;
    $(".word td").each(function () {
        if ($(this).html() == "?") {   //if the letter is "?"
            won = false;               //game not over
        }
    });
    return won;
}

/**
 * Resets the UI for the game.
 */
function resetUI() {
    $("#win").css('visibility', 'hidden');   //hide win banner
    $("#fail").css('visibility', 'hidden');  //hide loss banner
    $(".alphabet td").css('color', myWhite); //deselect all letters
    var letters = $(".word td");
    letters.html("");                        //hide word
    letters.css('color', myWhite);
    letters.animate({'opacity': '0.1'}, 100);
    var $images = $("div.image").children();
    $images.css('display', 'none'); //hide hangman
    $images.eq(0).fadeIn(fadeLength);
}

/**
 * Sets word
 */
function setWord() {
    wordOffset = parseInt((12-currentWord.length)/2);
    for (var i = 0; i < currentWord.length; i++) {
        var $word = $(".word td");
        $word.eq(i+wordOffset).html("?");
    }
}

/**
 * Resets the game variables to start a new round.
 */
function resetGame() {
    var newWordIndex = parseInt(Math.random() * words.length); //get random int for word
    currentWord = words[newWordIndex];     //set current word
    setWord();
    currentLetterColor = myWhite;          //reset current letter color
    incorrectGuesses = 0;                  //reset number of incorrect guesses
    clearInterval(loopedEvent);            //clear the blinking Timer
    addClickFunctions();                   //re-add click functions to the letters
    status = 1;
    toggleResetBtn();
}

/**
 * Get words from text file for the game.
 * @param file
 */
function getWords(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                words = allText.split('\r\n');
                wordsInit = true;
            }
        }
    };
    rawFile.send(null);
}