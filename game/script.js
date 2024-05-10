let width = 200;
let cards = [];

function createDeck() {
    let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    let ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            cards.push({suit: suits[i], rank: ranks[j]});
        }
    }
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
/*Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
function shuffleArray(array) {
    // start at the of the array and step towards the front
    for (var i = array.length - 1; i > 0; i--) {
        // pick a new location for the `i-th` card
        var j = Math.floor(Math.random() * (i + 1));
        // swap the position of cards `i` & `j`
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    console.log(array);
}

function drawCard(suit, rank) {
    $('#player-cards').append('<card-t suit="' + suit + '" rank="' + rank + '"></card-t>')
    width += 100;
    $('#player-cards').css('width', width + 'px');
    $('#player-cards').css('grid-template-columns', 'repeat(' + (width/100) + ', 1fr)');
}

function hit() {
    drawCard('hearts', 'A');
    createDeck();
    shuffleArray(cards);
}

$(document).ready(function() {
    $('#hit-button').click(hit);
});