let playersCardsWidth = 200;
let dealersCardsWidth = 200;
let cards = [];
let playersCards = [];
let dealersCards = [];
let playerTotal = 0;
let dealFaceDown = false;

function createDeck() {
    let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    let ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            cards.push({suit: suits[i], rank: ranks[j]});
        }
    }
}

function getCardValue(rank, handTotal) { 
    if (rank == 'A') {
        let newTotal = handTotal + 11;
        if (newTotal <= 21) {
            return 11;
        } else {
            return 1;
        }
    } else if ('JQK'.indexOf(rank) >= 0) {
        return 10;
    } else {
        return parseInt(rank);
    }
}

function checkAces(hand, handTotal) {
    if (handTotal > 21) {
        for (let i = 0; i < hand.length; i++) {
            if (hand[i].rank == 'A') {
                // the library allows for Aces to be selected by using A or 1
                hand[i].rank = '1';
                handTotal -= 10;
                if (handTotal <= 21) {
                    break;
                }
            }
        }
    }
    return handTotal;
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

function drawCard(playersTurn) {
    let card = cards.pop(0);
        let suit = card.suit;
        let rank = card.rank;
    if (playersTurn) {
        console.log(suit, rank);
        playersCards.push({suit: suit, rank: rank})
        console.log(playersCards)
        $('#player-cards').append('<card-t suit="' + suit + '" rank="' + rank + '"></card-t>')
        playersCardsWidth += 100;
        $('#player-cards').css('width', playersCardsWidth + 'px');
        $('#player-cards').css('grid-template-columns', 'repeat(' + (playersCardsWidth/100) + ', 1fr)');
        playerTotal = calculateTotal(playersCards);
        $('#player-total').text("Player's Total: " + playerTotal);
    } else {
        dealersCards.push({suit: suit, rank: rank})
        console.log(dealersCards)
        if (dealFaceDown) {
            $('#dealer-cards').append('<card-t rank="0" backcolor="red" backtext=""></card-t>')
            dealersCardsWidth += 100;
            $('#dealer-cards').css('width', dealersCardsWidth + 'px');
            $('#dealer-cards').css('grid-template-columns', 'repeat(' + (dealersCardsWidth/100) + ', 1fr)');
        } else {
            $('#dealer-cards').append('<card-t suit="' + suit + '" rank="' + rank + '"></card-t>')
            dealersCardsWidth += 100;
            $('#dealer-cards').css('width', dealersCardsWidth + 'px');
            $('#dealer-cards').css('grid-template-columns', 'repeat(' + (dealersCardsWidth/100) + ', 1fr)');
        }
    }
}

function hit() {
    drawCard(true);
    if (playerTotal > 21) {
        lose('You went over 21!');
    }
}

function stand() {
    console.log('stand');
    $("#hit-button").prop('disabled', 'disabled');
    $("#stand-button").prop('disabled', 'disabled');
}

function win(reason) {

}

function lose(reason) {
    $("#lose-reason").text(reason);
    $("#lose-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
}

function push() {
    $("#push-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
}

function deal() {
    drawCard(true)
    drawCard(false)
    dealFaceDown = true;
    drawCard(true)
    drawCard(false)
    dealFaceDown = false;
    dealerTotal = calculateTotal(dealersCards);
    if (dealerTotal !== 21) {
        if (playerTotal === 21) {
            win('You got a Blackjack!');
        }
    }
}

function calculateTotal(hand) {
    let total = 0;
    for (let i = 0; i < hand.length; i++) {
        total += getCardValue(hand[i].rank, total);
        total = checkAces(hand, total);
        console.log(hand);
    }
    return total;
}

$(document).ready(function() {
    createDeck();
    shuffleArray(cards);
    deal()
    $('#hit-button').click(hit);
    $('#stand-button').click(stand);
});