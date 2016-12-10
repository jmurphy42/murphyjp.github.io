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
    var url = "scores.json";
    $(url).find("score1").data(score1);
    $(url).find("score2").data(score2);
    $(url).find("score3").data(score3);
    $(url).find("score4").data(score4);
    $(url).find("score5").data(score5);
    $(url).find("name1").data(name1);
    $(url).find("name2").data(name2);
    $(url).find("name3").data(name3);
    $(url).find("name4").data(name4);
    $(url).find("name5").data(name5);


}

function getScores(){
    var url = "scores.json";
    var scores = [];
    $.getJSON(url,function(data){
        $.each(data, function(key, value){
            scores.push("<div id='"+key+"'>"+value+"</div>");
        });
        var score1 = data.score1,
            score2 = data.score2,
            score3 = data.score3,
            score4 = data.score4,
            score5 = data.score5,
            name1 = data.name1,
            name2 = data.name2,
            name3 = data.name3,
            name4 = data.name4,
            name5 = data.name5;

        document.getElementById("score1").innerHTML=score1+"";
        document.getElementById("name1").innerHTML=name1;
        document.getElementById("score2").innerHTML=score2+"";
        document.getElementById("name2").innerHTML=name2;
        document.getElementById("score3").innerHTML=score3+"";
        document.getElementById("name3").innerHTML=name3;
        document.getElementById("score4").innerHTML=score4+"";
        document.getElementById("name4").innerHTML=name4;
        document.getElementById("score5").innerHTML=score5+"";
        document.getElementById("name5").innerHTML=name5;
    });
}