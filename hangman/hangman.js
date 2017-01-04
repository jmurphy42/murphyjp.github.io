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

/**
 * Loop to wait for words file to load
 */
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

/**
 * Go home when div-link is clicked
 */
function goHome(){
    window.location.href = '../index.html';
}

/**
 * Fades or reveals Reset button depending on status of game
 */
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
                if (words[0].length>12){ //then some parsing issue occurred
                    hardWordsLoad();
                }
                wordsInit = true;
            }else{
                hardWordsLoad();
            }
        }
    };
    rawFile.send(null);
}

function hardWordsLoad(){
    words = ["ability","accident","account","accuracy","achievement","action",
        "activity","actress","addition","address","adjustment","admission",
        "advance","advantage","adventure","advertising","advocate","affair",
        "afternoon","agency","agenda","agreement","agriculture","airplane",
        "airport","alliance","alternative","aluminum","ambition","amendment",
        "amount","analysis","animal","anniversary","announcement","answer",
        "anxiety","apartment","apology","appearance","application","appointment",
        "appreciation","approach","approval","arrangement","article","artifact",
        "assault","assembly","assignment","association","assumption","athlete",
        "atmosphere","attack","attempt","attitude","attraction","auction",
        "audience","authority","automobile","availability","average","awareness",
        "background","backyard","bacteria","balance","balloon","banana",
        "bankruptcy","barrier","baseball","basement","basket","basketball",
        "bathroom","battery","battle","beauty","bedroom","beginning","behavior",
        "belief","benefit","bicycle","biography","biology","birthday","blanket",
        "bottle","bottom","boundary","branch","breakfast","breeze","bridge",
        "broadcast","bronze","brother","bubble","bucket","budget","building",
        "bullet","bureau","business","butterfly","button","cabinet",
        "calculation","calendar","camera","campaign","campus","candidate",
        "candle","canvas","capacity","capital","captain","carpet","carrier",
        "cartoon","casino","casualty","category","ceiling","celebration",
        "celebrity","century","ceremony","chairman","challenge","chamber",
        "champion","championship","channel","chapter","character","charge",
        "charity","charter","chemical","childhood","choice","circle","circuit",
        "circumstance","citizen","citizenship","civilization","classroom",
        "clothing","cluster","coalition","coffee","collapse","colleague",
        "collection","college","colony","column","combat","combination",
        "comedy","comfort","command","comment","commission","commitment",
        "committee","commodity","community","company","compensation",
        "competition","complaint","complexity","computer","concept","concert",
        "conclusion","condition","conference","confession","confidence",
        "conflict","confusion","connection","consensus","consequence",
        "conspiracy","constitution","construction","consultant","consumption",
        "container","continent","contribution","control","controversy",
        "convenience","convention","conversation","conviction","cookie",
        "cooperation","corner","corporation","correlation","corridor",
        "corruption","costume","cottage","cotton","counter","counterpart",
        "country","couple","courage","course","courtroom","cousin","coverage",
        "creation","creativity","creature","credibility","credit","criminal",
        "crisis","criteria","critic","criticism","cruise","crystal","culture",
        "curiosity","currency","curtain","custody","customer","damage",
        "dancing","darkness","database","daughter","deadline","debate",
        "debris","decade","decision","defendant","defender","defense",
        "deficit","definition","degree","delight","delivery","democracy",
        "density","department","departure","deposit","description","desert",
        "design","desire","dessert","destination","destruction","detail",
        "detective","development","device","diagnosis","dialogue","diamond",
        "difference","difficulty","dilemma","dimension","direction","disaster",
        "discipline","discount","discovery","discussion","display","distance",
        "distinction","distribution","division","document","documentary",
        "donation","doorway","drawing","driveway","dynamics","earnings",
        "earthquake","economics","economy","ecosystem","edition","education",
        "efficiency","election","electricity","electronics","elevator",
        "emergency","emotion","emphasis","empire","employment","encounter",
        "energy","engagement","engine","enterprise","enthusiasm","entity",
        "entrance","envelope","environment","episode","equality","equation",
        "equipment","equity","equivalent","escape","essence","estate",
        "estimate","ethics",
        "evaluation","evidence","examination","example","excitement",
        "execution","exercise","exhibit","exhibition","existence","expansion",
        "expedition","expense","experience","experiment","expert","explanation",
        "explosion","exposure","expression","eyebrow","fabric","factory",
        "failure","family","fantasy","fashion","father","fatigue","favorite",
        "feather","feature","feedback","feeling","festival","fiction",
        "fighting","figure","finance","finger","finish","fitness","flavor",
        "flexibility","flight","flower","football","forest","formation",
        "formula","fortune","foundation","fraction","fragment","framework",
        "franchise","freedom","frequency","friend","friendship","frontier",
        "frustration","function","furniture","future","galaxy","gallery",
        "garage","garbage","garden","garlic","general","generation","genius",
        "gesture","glance","glimpse","government","graduation","grandchild",
        "grandparent","gravity","grocery","growth","guarantee","guideline",
        "guitar","habitat","handful","happiness","harassment","hardware",
        "harmony","harvest","hazard","headache","headline","headquarters",
        "health","heaven","helicopter","helmet","heritage","highway","history",
        "hockey","holiday","homework","horizon","horror","hospital","hostage",
        "household","humanity","hurricane","hypothesis","identity","illness",
        "illusion","imagination","implication","importance","impression",
        "improvement","impulse","incentive","incident","income","independence",
        "indication","individual","industry","information","ingredient",
        "initiative","injury","innovation","insect","insight","inspection",
        "inspiration","installation","instant","instinct","institution",
        "instruction","instrument","integrity","intelligence","intensity",
        "interaction","interest","interview","introduction","invention",
        "inventory","investment","invitation","involvement","island","jacket",
        "jewelry","journal","journey","judgment","jungle","jurisdiction",
        "justice","kingdom","kitchen","knowledge","laboratory","landmark",
        "landscape","language","laughter","launch","laundry","lawmaker",
        "leadership","league","leather","lecture","legacy","legend",
        "legislation","lesson","letter","liability","liberty","library",
        "license","lifestyle","lifetime","lightning","likelihood","limitation",
        "liquid","literature","living","location","loyalty","machine","magazine",
        "magnitude","maintenance","majority","management","mansion",
        "manufacturer","marble","margin","marketplace","marriage","master",
        "material","mathematics","measurement","medication","medicine",
        "medium","meeting","membership","memory","mention","merchant","message",
        "metaphor","method","midnight","migration","military","mineral",
        "minute","miracle",
        "mirror","missile","mission","mistake","mixture","molecule","moment",
        "momentum","monitor","monster","monument","morning","mother","motion",
        "motivation","motive","mountain","movement","murder","muscle","museum",
        "musician","mystery","narrative","nation","nature","necessity","needle",
        "negotiation","neighbor","neighborhood","network","newspaper",
        "nightmare","nomination","nominee","notebook","notice","notion","number",
        "nutrient","object","objection","objective","obligation","observation",
        "obstacle","occasion","occupation","offense","office","official",
        "operation","opinion","opponent","opportunity","option","orange",
        "organism","organization","orientation","origin","outcome","output",
        "ownership","oxygen","package","painting","palace","parade","parent",
        "participant","particle","partner","partnership","passenger","passion",
        "patience","patient","patrol","pattern","payment","peanut","penalty",
        "pencil","people","percentage","perception","performance","period",
        "permission","person","personality","perspective","phenomenon",
        "philosophy","photograph","photography","phrase","physics","picture",
        "pillow","pioneer","pistol","pitcher","placement","planet","plastic",
        "platform","player","pleasure","pocket","poetry","policy","politics",
        "portfolio","portrait","position","possession","possibility","poster",
        "potential","powder","practice","practitioner","praise","predator",
        "prediction","premium","preparation","present","presentation",
        "president","pressure","primary","priority","privacy","privilege",
        "problem","product","production","profile","profit","program",
        "progress","project","projection","promise","promotion","property",
        "protection","protein","protest","protocol","province","publication",
        "publicity","punishment","pursuit","puzzle","quarter","quarterback",
        "question","rabbit","railroad","reaction","reading","reality",
        "reception","recession","recipient","recognition","reference",
        "reflection","refrigerator","regulation","relationship","reminder",
        "replacement","republic","reputation","requirement","rescue",
        "research","reservation","resistance",
        "resource","respect","restaurant","retailer","revenue","revolution",
        "reward","rhetoric","rhythm","ribbon","rocket","romance","sacrifice",
        "sample","sanction","sandwich","satellite","satisfaction","scandal",
        "scenario","schedule","scholarship","school","science","script",
        "sculpture","search","season","secret","secretary","security",
        "sensation","sensitivity","sentence","sequence","session","settlement",
        "shadow","shelter","shoulder","shower","shuttle","sidewalk","signature",
        "significance","silence","similarity","sister","situation","soccer",
        "society","software","soldier","solution","sovereignty","spectrum",
        "speech","sphere","spirit","spring","square","stadium","standard",
        "statement","station","statistics","statue","stereotype","stomach",
        "stranger","strategy","strength","structure","struggle","student",
        "studio","subject","substance","suburb","success","suggestion",
        "summary","summer","sunlight","supermarket","surface","surprise",
        "surveillance","survey","suspect","suspicion","sweater","swimming",
        "witch","symbol","sympathy","symptom","tablespoon","talent","target",
        "teammate","teaspoon","technician","technology","teenager","telephone",
        "telescope","television","temperature","temple","tendency","tennis",
        "territory","testimony","textbook","texture","theater","thought",
        "throat","ticket","tissue","tolerance","tomato","tongue","touchdown",
        "tournament","tradition","traffic","tragedy","transaction","transition",
        "translation","transmission","travel","treasure","triumph","trouble",
        "uniform","universe","university","vacation","vacuum","variable",
        "variety","vegetable","vehicle","victory","village","virtue","vision",
        "vitamin","volunteer","warehouse","warmth","warrior","wealth",
        "weather","weekend","wilderness","wildlife","window","winter",
        "wisdom","wonder","workplace","workshop"];
    wordsInit = true;
}