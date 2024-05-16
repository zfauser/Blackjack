let playersCardsWidth = 200;
let dealersCardsWidth = 200;
let cards = [];
let playersCards = [];
let dealersCards = [];
let dealFaceDown = false;
let playerTotal = 0;
let dealerTotal = 0;
let balance = 0;
let bet = 0;
let originalBalance = 0;
let blackjack = false;

function saveVariables() 
/*
  Purpose: To save the variables to local storage, which allows them to be saved between sessions
*/
{
  localStorage.setItem("balance", balance);
  localStorage.setItem("bet", bet);
}

function loadVariables()
/* 
  Purpose: To load the variables from local storage
*/
{
    balance = parseInt(localStorage.getItem("balance"));
    bet = parseInt(localStorage.getItem("bet"));
    console.log(balance, bet);
    $("#bet").text("Bet: " + bet);
}

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
            $('#dealer-cards').append('<card-t id="hidden-card" rank="0" backcolor="red" backtext=""></card-t>')
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

function dealersTurn() {
    $('#hidden-card').remove();
    $('#dealer-cards').append('<card-t suit="' + dealersCards[1].suit + '" rank="' + dealersCards[1].rank + '"></card-t>')
    dealerTotal = calculateTotal(dealersCards);
    $('#dealer-total').text("Dealer's Total: " + dealerTotal);
    while (dealerTotal < 17) {
        drawCard(false);
        dealerTotal = calculateTotal(dealersCards);
        $('#dealer-total').text("Dealer's Total: " + dealerTotal);
    }
    checkWinner();
}

function checkWinner() {
    if (dealerTotal > 21) {
        win('Dealer went over 21!');
    } else if (dealerTotal === playerTotal) {
        push();
    } else if (dealerTotal > playerTotal) {
        lose('Dealer got a total of ' + dealerTotal + ' and you got a total of ' + playerTotal + '. \n Dealer wins!');
    } else {
        win('You got a total of ' + playerTotal + ' and the dealer got a total of ' + dealerTotal + '. You win!');
    }
}

function hit() {
    drawCard(true);
    if (playerTotal > 21) {
        lose('You went over 21!');
    } else if (playerTotal === 21) {
        stand();
    }
}

function stand() {
    console.log('stand');
    $("#hit-button").prop('disabled', 'disabled');
    $("#stand-button").prop('disabled', 'disabled');
    dealersTurn();
}

function win(reason) {
    $("#win-reason").text(reason);
    originalBalance = balance;
    if (blackjack) {
        bet = Math.round(bet * 1.5)
    }
    balance += bet;
    $("#win-balance").text("Your Balance is now: "  + balance +" Smarties (was " + originalBalance + " Smarties)")
    saveVariables();
    $("#win-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
}

function lose(reason) {
    $("#lose-reason").text(reason);
    originalBalance = balance;
    balance -= bet;
    $("#lose-balance").text("Your Balance is now: "  + balance +" Smarties (was " + originalBalance + " Smarties)")
    saveVariables();
    $("#lose-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
}

function push() {
    saveVariables();
    $("#push-balance").text("Your Balance is still: " + balance + " Smarties")
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
            blackjack = true;
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

function playAgain() {
    window.location.href = '/bet';
}

$(document).ready(function() {
    loadVariables();
    createDeck();
    shuffleArray(cards);
    deal()
    $('#hit-button').click(hit);
    $('#stand-button').click(stand);
    $('.play-again').click(playAgain);
});