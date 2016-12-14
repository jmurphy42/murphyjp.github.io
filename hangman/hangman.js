/*
 * Created by Jason Murphy (murphyjp) on 12/13/2016.
 * Lab 4: jQuery-based Hangman game
 * SE2840 Web Application Development
 * MSOE, Dr. Jay Urbain
 */

/**
 * This file contains the jQuery and JavaScript code that implements the game logic.
 */

// Here is a sample array of 6-character words to be guessed.
var words = ["abacus", "bamboo", "cuckoo", "dimple", "easter", "filter",
    "geyser", "happen", "indigo", "jersey", "karate", "little",
    "marker", "normal", "oblong", "patent", "quiche", "random",
    "sleepy", "terror", "unable", "violet", "wallet", "xylene",
    "yellow", "zipper"];
var currentLetterColor = "white";
var currentWord = "";
var incorrectGuesses = 0;
var wins = 0;
var losses = 0;
var loopedEvent;      //setInterval object, which blinks the win/loss banners
var blinkTime = 500;  //how long each blink takes, in milliseconds
var fadeLength = 500; //how long it takes for items to fade in

/**
 * onload:
 * Sets up UI and Game variables.
 * Attaches mouse listeners to various DOM elements.
 */
$(document).ready(function () {
    resetUI();
    resetGame();

    // Use jQuery to get elements
    var $letters = $(".alphabet td");
    var $resetButton = $("#reset");

    // Handle the mouseover event for letters in the alphabet
    // Highlight each letter in the alphabet yellow as the mouse passes over
    $letters.mouseover(function () {
        currentLetterColor = $(this).css('color');
        $(this).css('color', 'yellow');
    });

    // Handle the mouseout event for letters in the alphabet
    // Turn the highlight off when the mouse leaves an alphabet letter, but be sure to change
    // it back to red, white, or green as appropriate.
    $letters.mouseout(function () {
        $(this).css('color', currentLetterColor);
    });

    // Handle the reset button event
    $resetButton.click(function () {
        resetUI();
        resetGame();
    });


});

/**
 * Adds click functions to the letters
 */
function addClickFunctions(){
    var $letters = $(".alphabet td");
    $letters.click(function () {
        clickLetter(this);
    });
}

/**
 * Removes click functions from the letters
 */
function removeClickFunctions(){
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
    $('.alphabet td:contains('+letter+')').off('click');

    //correct guess
    if (letterCheck.correct) {
        letterClicked.style.color = 'green';
        currentLetterColor = 'green';

        for (var l = 0; l < currentWord.length; l++) {  //cycle through letters in word
            if (letterCheck.place[l] == 1) {            //if the letter is correct
                revealLetter(l, letter, 'black');       //reveal the letter
            }
        }

        if (checkForWin()) {
            youWin();
        }

        // incorrect guess
    } else {
        letterClicked.style.color = 'red';
        currentLetterColor = 'red';

        $("div.image div").eq(incorrectGuesses).fadeOut(fadeLength); //reveal piece of hangman
        incorrectGuesses++;

        if (incorrectGuesses >= 6) {  //
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
    $(".word td").css('color','green');
    wins++;
    removeClickFunctions();
    updateTitle();
}

/**
 * Handles the lose condition
 */
function youLose() {
    var lossBanner = $("#fail");
    blinkBanner(lossBanner);
    for (var n = 0; n < currentWord.length; n++) {
        var $letter = $(".word td").eq(n);
        if ($letter.html() == "?") {                           //if the letter is "?"
            revealLetter(n, currentWord.charAt(n), 'darkred'); //reveal it
        }
    }
    losses++;
    removeClickFunctions();
    updateTitle();
}

/**
 * Updates the website's title with the current wins & losses
 */
function updateTitle(){
    $(document).prop('title',
        "Jason Murphy W:" + wins + " L:" + losses);
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
 * @param color  - color as which to reveal letter
 */
function revealLetter(index, letter, color) {
    var letterCell = $(".word td").eq(index);
    letterCell.html(letter);             //write it here
    letterCell.css('color', color);
    letterCell.animate({'opacity':'1'},fadeLength);
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
        if ($(this).html() == "?") {    //if the letter is "?"
            won = false;             //game not over
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
    $(".alphabet td").css('color', 'white'); //deselect all letters
    var letters = $(".word td");
    letters.html("?");                       //hide word
    letters.css('color', 'lightblue');
    letters.animate({'opacity':'0.1'},100);
    $(".image div").fadeIn(100);             //hide hangman
}

/**
 * Resets the game variables to start a new round.
 */
function resetGame() {
    var newWordIndex = parseInt(Math.random() * words.length); //get random int for word
    currentWord = words[newWordIndex];     //set current word
    currentLetterColor = "white";          //reset current letter color
    incorrectGuesses = 0;                  //reset number of incorrect guesses
    clearInterval(loopedEvent);            //clear the blinking Timer
    addClickFunctions();                   //re-add click functions to the letters
}