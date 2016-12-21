/**
 * Created by murphyjp on 12/19/2016.
 */
var randomNames = [
    'Aardvark',
    'Badger',
    'Cheetah',
    'Dingo',
    'Elephant',
    'Flamingo',
    'Giraffe',
    'Hippo',
    'Iguana',
    'Jackal',
    'Kangaroo',
    'Llama',
    'Moose',
    'Ocelot',
    'Platypus',
    'Raccoon',
    'Sloth',
    'Tortoise',
    'Wombat',
    'Yak',
    'Zebra'];
var currentNames = [];

$(document).ready(function(){
    $('#name').text(getRandomName()+"");
});

function getRandomName(){
    var r = parseInt(Math.random()*randomNames.length);
    return randomNames[r];
}