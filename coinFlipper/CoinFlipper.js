/*
 * Created by Jason Murphy (murphyjp) on 12/4/2016.
 * Lab 2: Introduction to JavaScript
 * SE2840 Web Application Development
 * MSOE, Dr. Jay Urbain
 */

/**
 * On page load, set the button's event listener to parse data.
 */
function initCoinFlipper(){
    document.getElementById("button").addEventListener("click", parseInput);
}

/**
 * This is the main function that runs the other helper methods
 * to execute flips on 'numCoins' coins 'numFlips' times. The
 * result is outputted to the HTML page.
 */
function run(numCoins, numFlips){
    var frequency = [];
    for (var n=0; n<numCoins+1; n++){ //initialize array with 0s.
        frequency.push(0);
    }

    var executionTime = new Date().getMilliseconds();

    frequency = flipCoins(frequency, numCoins, numFlips);
    displayData(frequency, numCoins, numFlips);

    executionTime = new Date().getMilliseconds() - executionTime;
    document.getElementById("timer").innerHTML = executionTime+"";
}

/**
 * Parses the input fields, validates them, displays errors if they occur,
 * or RUN if no errors occur.
 */
function parseInput(){
    //hide the HTML elements
    document.getElementById("dataTitle").style.display = "none";
    document.getElementById("dataTable").style.display = "none";
    for(var i = 0; i<=10; i++){
        document.getElementById("r"+i).style.display = "none";
    }
    document.getElementById("dataTimer").style.display = "none";

    //try to parse the data
    var numCoinsInput = document.getElementById("coinForm").value;
    var numCoins = parseInt(numCoinsInput);
    var numFlipsInput = document.getElementById("flipForm").value;
    var numFlips = parseInt(numFlipsInput);

    //validate the data
    if (isNaN(numCoins) || numCoins<1 || numCoins>10){
        document.getElementById("coinError").innerHTML =
            "The number of coins is invalid.<br />Please enter an integer between 1 and 10.";
        numCoins = 0;
    }
    if (isNaN(numFlips) || numFlips<1 || numFlips>100000){
        document.getElementById("flipError").innerHTML =
            "The number of flips is invalid.<br />Please enter an integer between 1 and 100,000.";
        numFlips = 0;
    }

    //all is good? run the script
    if(numCoins>0 && numFlips>0){
        document.getElementById("coinError").innerHTML = "";
        document.getElementById("flipError").innerHTML = "";
        run(numCoins, numFlips);
    }
}

/**
 * Flips the coins and reports the results
 * @param frequency the empty array to which results will be recorded
 * @param numCoins  the number of coins to flip
 * @param numFlips  the number of times to flip said coins
 * @returns {*}     frequency, the results of the flips
 */
function flipCoins(frequency, numCoins, numFlips){
    for (var rep=0; rep < numFlips; rep++){
        var heads = doSingleFlip(numCoins);
        frequency[heads]++;
    }
    return frequency;
}

/**
 * Flips the set of coins once
 * @param numCoins   the number of coins to flip once
 * @returns {number} the result of the coin flips
 */
function doSingleFlip(numCoins){
    var heads = 0;
    for (var i = 0; i<numCoins; i++){
        heads += parseInt(Math.random()*2);
    }
    return heads;
}

/**
 * Prints the results of the coin flips to the HTML page
 * @param frequency the results of the coin flips
 * @param numCoins  the number of coins flipped
 * @param numFlips  the number of times said coins were flipped
 */
function displayData(frequency, numCoins, numFlips){
    //display the HTML elements
    document.getElementById("dataTitle").style.display = "block";
    document.getElementById("dataTable").style.display = "block";
    for(var j = 0; j<=numCoins; j++){
        document.getElementById("r"+j).style.display = "block";
    }
    document.getElementById("dataTimer").style.display = "block";

    //Now input the data
    for (var heads=0; heads<=numCoins; heads++){
        var percent = parseInt(frequency[heads] * 1000 / numFlips) / 10.0;
        var fullWidth = 650;
        document.getElementById("n"+heads).innerHTML = frequency[heads];
        document.getElementById("pbn"+heads).innerHTML = percent+"%";
        document.getElementById("pbn"+heads).style.marginLeft = ((fullWidth*(percent/100))+3)+"px";
        document.getElementById("pb"+heads).style.width = (fullWidth*(percent/100))+"px";
    }
}