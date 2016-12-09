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
    alert("getting scores");

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText;
            var score1 = data.getItem("score1"),
                score2 = data.getItem("score2"),
                score3 = data.getItem("score3"),
                score4 = data.getItem("score4"),
                score5 = data.getItem("score5");
            var name1 = data.getItem("name1"),
                name2 = data.getItem("name2"),
                name3 = data.getItem("name3"),
                name4 = data.getItem("name4"),
                name5 = data.getItem("name5");
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