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

    var data = {
        score1: score1,
        score2: score2,
        score3: score3,
        score4: score4,
        score5: score5,
        name1: name1,
        name2: name2,
        name3: name3,
        name4: name4,
        name5: name5
    };

    alert("I am about to POST this: "+data.toString());

    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    var url = "scores.json";
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Content-length', json.length+"");
    xhr.setRequestHeader('Connection', 'close');

    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        }
    };

    xhr.send(json);
}

function getScores(){
    var url = "scores.json";
    var scores = [];
    $.getJSON(url,function(data){
        $.each(data, function(key, value){
            scores.push("<div id='"+key+"'>"+value+"</div>");
        });
        alert("data.score1="+data.score1);
        alert("scores.score1="+scores.score1);

        // for (var i = 0; i<scores.length; i++){
        //     document.getElementById("score"+(i+1)).innerHTML=scores[i].toString();
        //     document.getElementById("name"+(i+1)).innerHTML=names[i].toString();
        // }
    });
}