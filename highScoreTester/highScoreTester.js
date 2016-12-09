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
    var data = "score1="+score1+"&name1="+name1+"&score2="+score2+"&name2="+name2+
        "&score3="+score3+"&name3="+name3+"&score4="+score4+"&name4="+name4+
        "&score5="+score5+"&name5="+name5;

    alert("I am about to POST this:\n\n" + data);

    var xhr = new XMLHttpRequest();
    var url = "scores.json";
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Content-length', data.length+"");
    xhr.setRequestHeader('Connection', 'close');

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            alert(xhr.responseText);
        }
    };

    xhr.send(data);
}

function getScores(){
    var xhr = new XMLHttpRequest();
    var url = "scores.json";

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            // var data = JSON.parse(response);
            alert("Trying to parse this: "+response);
            var score1 = response[0],
                score2 = response[1],
                score3 = response[2],
                score4 = response[3],
                score5 = response[4];
            var name1 = response[5],
                name2 = response[6],
                name3 = response[7],
                name4 = response[8],
                name5 = response[9];
            document.getElementById("score1").innerHTML=score1+"";
            document.getElementById("score2").innerHTML=score2+"";
            document.getElementById("score3").innerHTML=score3+"";
            document.getElementById("score4").innerHTML=score4+"";
            document.getElementById("score5").innerHTML=score5+"";
            document.getElementById("name1").innerHTML=name1;
            document.getElementById("name2").innerHTML=name2;
            document.getElementById("name3").innerHTML=name3;
            document.getElementById("name4").innerHTML=name4;
            document.getElementById("name5").innerHTML=name5;
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}