/**
 * Created by murphyjp on 12/8/2016.
 */
function sendScores() {
    var score1 = parseInt(document.getElementById("score1").innerHTML),
        score2 = parseInt(document.getElementById("score2").innerHTML),
        score3 = parseInt(document.getElementById("score3").innerHTML),
        score4 = parseInt(document.getElementById("score4").innerHTML),
        score5 = parseInt(document.getElementById("score5").innerHTML);
    var name1 = (document.getElementById("name1").innerHTML),
        name2 = (document.getElementById("name2").innerHTML),
        name3 = (document.getElementById("name3").innerHTML),
        name4 = (document.getElementById("name4").innerHTML),
        name5 = (document.getElementById("name5").innerHTML);

    var data = "<highscores><n1><score>"+score1+"</score><name>"+name1+"</name></n1>"+
            "<n2><score>"+score2+"</score><name>"+name2+"</name></n2>"+
            "<n3><score>"+score3+"</score><name>"+name3+"</name></n3>"+
            "<n4><score>"+score4+"</score><name>"+name4+"</name></n4>"+
            "<n5><score>"+score5+"</score><name>"+name5+"</name></n5></highscores>";

    alert("I am about to POST something");

    var xhr = new XMLHttpRequest();
    var url = "scores.xml";
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'text/xml');
    xhr.setRequestHeader('Content-length', data.length+"");
    xhr.setRequestHeader('Connection', 'close');

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    };

    xhr.send(data);
}

function getScores(){
    var xhr = new XMLHttpRequest();
    var url = "scores.xml";

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var xml = this.responseXML;
            var scores = xml.getElementsByTagName("score");
            var names = xml.getElementsByTagName("name");
            for (var i = 0; i<scores.length; i++){
                document.getElementById("score"+(i+1)).innerHTML=scores[i].toString();
                document.getElementById("name"+(i+1)).innerHTML=names[i].toString();
            }
        }
    };

    xhr.open('GET', url, true);
    xhr.send();
}