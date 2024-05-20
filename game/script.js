/*
  Name: Zach Fauser
  Date: May 6th, 2024
  Purpose: To allow the user to play blackjack
*/
let playersCardsWidth = 200;
let dealersCardsWidth = 200;
let cards = [];
let playersCards = [];
let dealersCards = [];
let dealFaceDown = false;
let playerTotal = 0;
let dealerTotal = 0;
let balance = 100;
let bet = 0;
let originalBalance = 0;
let blackjack = false;
let wins = 0;
let losses = 0;
let ties = 0;
let firstTurn = true;

function saveVariables() {
  /*
  Purpose: To save the variables to local storage, which allows them to be saved between sessions
*/
  localStorage.setItem("balance", balance);
  localStorage.setItem("bet", bet);
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  localStorage.setItem("ties", ties);
}

function saveCards() {
  /*
    Purpose: To save the cards to local storage, which makes sure that if the user cannot cheat by refreshing the page and getting new cards
    Source for how to save arrays in local storage: https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage
*/
  localStorage.setItem("cards", JSON.stringify(cards));
  localStorage.setItem("playersCards", JSON.stringify(playersCards));
  localStorage.setItem("dealersCards", JSON.stringify(dealersCards));
}

function loadVariables() {
  /* 
  Purpose: To load the variables from local storage
*/
  if (localStorage.getItem("balance")) {
    balance = parseInt(localStorage.getItem("balance"));
    bet = parseInt(localStorage.getItem("bet"));
    wins = parseInt(localStorage.getItem("wins"));
    losses = parseInt(localStorage.getItem("losses"));
    ties = parseInt(localStorage.getItem("ties"));
    $("#bet").text("Bet: " + bet);
  } else {
    saveVariables();
    localStorage.setItem("path", "/");
    window.location.href = localStorage.getItem("path");
  }

  if (localStorage.getItem("path")) {
    // the dealer isn't supposed to be on this page
    if (localStorage.getItem("path") != "/game") {
      // put them back on the page they are supposed to be on
      window.location.href = localStorage.getItem("path");
    }
  }
}

function createDeck() {
  /*
    Purpose: to create a deck of cards
*/
  let suits = ["hearts", "diamonds", "clubs", "spades"];
  let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      cards.push({ suit: suits[i], rank: ranks[j] });
    }
  }
}

function shuffleArray(array) {
  /* 
    Randomize array in-place using Durstenfeld shuffle algorithm
    Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 
*/
  // start at the of the array and step towards the front
  for (var i = array.length - 1; i > 0; i--) {
    // pick a new location for the `i-th` card
    var j = Math.floor(Math.random() * (i + 1));
    // swap the position of cards `i` & `j`
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function drawCard(playersTurn) {
  /*
    Args:
        playersTurn: True if it's the player's turn, False if it's the dealer's turn
    Purpose: draw a card from the deck and add it to the player's or dealer's hand
*/
  let card = cards.pop(0);
  let suit = card.suit;
  let rank = card.rank;
  if (playersTurn) {
    playersCards.push({ suit: suit, rank: rank });
    //  I use the cardmeister library to display the cards
    let playerCard = $(
      '<card-t suit="' + suit + '" rank="' + rank + '"></card-t>'
    ).hide();

    // change the css in order to keep the cards centered
    playersCardsWidth += 100;
    $("#player-cards").css("width", playersCardsWidth + "px");
    // make it so the cards stay on the same row
    $("#player-cards").css(
      "grid-template-columns",
      "repeat(" + playersCardsWidth / 100 + ", 1fr)"
    );
    // add the card to the grid
    $("#player-cards").append(playerCard);

    playerCard.fadeIn(250);
    playerTotal = calculateTotal(playersCards);
    $("#player-total").text("Player's Total: " + playerTotal);
  } else {
    dealersCards.push({ suit: suit, rank: rank });
    if (dealFaceDown) {
      // for the dealers second card, show it face down
      let hiddenCard = $(
        '<card-t id="hidden-card" rank="0" backcolor="red" backtext=""></card-t>'
      ).hide();
      dealersCardsWidth += 100;
      $("#dealer-cards").css("width", dealersCardsWidth + "px");
      $("#dealer-cards").css(
        "grid-template-columns",
        "repeat(" + dealersCardsWidth / 100 + ", 1fr)"
      );
      $("#dealer-cards").append(hiddenCard);
      hiddenCard.fadeIn(250);
    }
    // otherwise, show the card face up
    else {
      let dealerCard = $(
        '<card-t suit="' + suit + '" rank="' + rank + '"></card-t>'
      ).hide();
      dealersCardsWidth += 100;
      $("#dealer-cards").css("width", dealersCardsWidth + "px");
      $("#dealer-cards").css(
        "grid-template-columns",
        "repeat(" + dealersCardsWidth / 100 + ", 1fr)"
      );
      $("#dealer-cards").append(dealerCard);
      dealerCard.fadeIn(250);
    }
  }
  saveVariables();
}

function dealersTurn() {
  /*
    Purpose: after the user stands, the dealer will keep hitting until they have a total of 17 or higher
*/
  $("#hidden-card").remove();
  $("#dealer-cards").append(
    '<card-t suit="' +
    dealersCards[1].suit +
    '" rank="' +
    dealersCards[1].rank +
    '"></card-t>'
  );
  dealerTotal = calculateTotal(dealersCards);
  $("#dealer-total").text("Dealer's Total: " + dealerTotal);
  while (dealerTotal < 17) {
    drawCard(false);
    dealerTotal = calculateTotal(dealersCards);
    $("#dealer-total").text("Dealer's Total: " + dealerTotal);
    saveCards();
    if (dealerTotal > 21) {
      break;
    }
  }

  // delay one second so the user can see the dealer's final cards before showing how wins and loses
  setTimeout(function() {
    checkWinner();
  }, 1000);
}

function checkWinner() {
  /*
    Purpose: to check who wins and loses
*/
  if (dealerTotal > 21) {
    win("Dealer went over 21!");
  } else if (dealerTotal === playerTotal) {
    push();
  } else if (dealerTotal > playerTotal) {
    lose(
      "Dealer got a total of " +
      dealerTotal +
      " and you got a total of " +
      playerTotal +
      ". \n Dealer wins!"
    );
  } else {
    win(
      "You got a total of " +
      playerTotal +
      " and the dealer got a total of " +
      dealerTotal +
      ". You win!"
    );
  }
  localStorage.setItem("cards", JSON.stringify(cards));
}

function hit() {
  /*
    Purpose: to draw a card for the player
*/
  setTimeout(function() {
    $("#hit-button").prop("disabled", "disabled");
    $("#stand-button").prop("disabled", "disabled");
    $("#double-button").prop("disabled", "disabled")
    drawCard(true);
    saveCards();
  }, 0);

  // wait for animation to finish before allowing user to keep playing
  setTimeout(function() {
    // automatically lose if the player goes over 21
    if (playerTotal > 21) {
      lose("You went over 21!");
    }
    // automatically stand if the player gets 21
    else if (playerTotal === 21) {
      stand();
    }
    $("#hit-button").prop("disabled", false);
    $("#stand-button").prop("disabled", false);
  }, 250);
}

function stand() {
  /*
    Purpose: to end the player's turn and start the dealer's turn
*/
  $("#hit-button").prop("disabled", "disabled");
  $("#stand-button").prop("disabled", "disabled");
  $("#double-button").prop("disabled", "disabled")
  dealersTurn();
}

function win(reason) {
  /*
    Args:
        reason: the reason the user won
    Purpose: show a modal to tell the user that they won and how much money they made
*/
  $("#win-reason").text(reason);
  originalBalance = balance;
  if (blackjack) {
    // pay 3 to 2 for blackjack
    bet = Math.round(bet * 1.5);
  }
  balance += bet;
  $("#win-balance").text(
    "Your Balance is now: " +
    balance +
    " Smarties (was " +
    originalBalance +
    " Smarties)"
  );
  wins += 1;
  saveVariables();
  localStorage.setItem("path", "/bet");
  localStorage.removeItem("playersCards");
  localStorage.removeItem("dealersCards");
  $("#win-modal").modal({
    escapeClose: false,
    clickClose: false,
    showClose: false,
  });
}

function lose(reason) {
  /*
    Args:
        reason: the reason the user lost
    Purpose: show a modal to tell the user that they lost and how much money they lost
*/
  $("#lose-reason").text(reason);
  originalBalance = balance;
  balance -= bet;
  $("#lose-balance").text(
    "Your Balance is now: " +
    balance +
    " Smarties (was " +
    originalBalance +
    " Smarties)"
  );
  losses += 1;
  saveVariables();
  localStorage.setItem("path", "/bet");
  localStorage.removeItem("playersCards");
  localStorage.removeItem("dealersCards");
  $("#lose-modal").modal({
    escapeClose: false,
    clickClose: false,
    showClose: false,
  });
}

function push() {
  /*
    Purpose: if the user and the dealer have the same total, tell the user that they pushed
*/
  ties += 1;
  saveVariables();
  localStorage.setItem("path", "/bet");
  localStorage.removeItem("playersCards");
  localStorage.removeItem("dealersCards");
  $("#push-balance").text("Your Balance is still: " + balance + " Smarties");
  $("#push-modal").modal({
    escapeClose: false,
    clickClose: false,
    showClose: false,
  });
}

function drawPreviousCards() {
  /*
    Purpose: if the user refreshes the page, draw the cards that were already drawn
*/
  playersCards = JSON.parse(localStorage.getItem("playersCards"));
  dealersCards = JSON.parse(localStorage.getItem("dealersCards"));
  cards = JSON.parse(localStorage.getItem("cards"));
  playersCardsWidth = 200;
  dealersCardsWidth = 200;
  for (let i = 0; i < playersCards.length; i++) {
    let suit = playersCards[i].suit;
    let rank = playersCards[i].rank;
    let playerCard = $(
      '<card-t suit="' + suit + '" rank="' + rank + '"></card-t>'
    ).hide();
    playersCardsWidth += 100;
    $("#player-cards").css("width", playersCardsWidth + "px");
    $("#player-cards").css(
      "grid-template-columns",
      "repeat(" + playersCardsWidth / 100 + ", 1fr)"
    );
    $("#player-cards").append(playerCard);
    playerCard.fadeIn(250);
  }
  for (let i = 0; i < dealersCards.length; i++) {
    let suit = dealersCards[i].suit;
    let rank = dealersCards[i].rank;
    let dealerCard = $(
      '<card-t suit="' + suit + '" rank="' + rank + '"></card-t>'
    ).hide();
    if (dealersCards.length === 2 && i === 1) {
      dealerCard = $(
        '<card-t id="hidden-card" rank="0" backcolor="red" backtext=""></card-t>'
      ).hide();
    }
    dealersCardsWidth += 100;
    $("#dealer-cards").css("width", dealersCardsWidth + "px");
    $("#dealer-cards").css(
      "grid-template-columns",
      "repeat(" + dealersCardsWidth / 100 + ", 1fr)"
    );
    $("#dealer-cards").append(dealerCard);
    dealerCard.fadeIn(250);
  }
  playerTotal = calculateTotal(playersCards);
  $("#player-total").text("Player's Total: " + playerTotal);
}

function deal() {
  /*
    purpose: to deal the cards to the player and the dealer at the start of the game
*/
  $("#hit-button").prop("disabled", "disabled");
  $("#stand-button").prop("disabled", "disabled");
  $("#double-button").prop("disabled", "disabled")
  if (localStorage.getItem("dealersCards")) {
    let tempPlayersCards = JSON.parse(localStorage.getItem("playersCards"));
    if (tempPlayersCards.length >= 2) {
      drawPreviousCards();
      $("#hit-button").prop("disabled", false);
      $("#stand-button").prop("disabled", false);
      if (tempPlayersCards.length === 2) {
        if ((bet * 2) <= balance) {
          $("#double-button").prop("disabled", false);
        }
      } else {
        $("#double-button").prop("disabled", "disabled");
      }
    }
  } else {
    // deal the players card, dealer's card, player's card, dealer's card
    setTimeout(function() {
      drawCard(true);
    }, 0);
    setTimeout(function() {
      drawCard(false);
    }, 250);
    setTimeout(function() {
      drawCard(true);

      // make it so the dealers second card will be shown face down
      dealFaceDown = true;
    }, 500);
    setTimeout(function() {
      drawCard(false);
      saveCards();
      $("#hit-button").prop("disabled", false);
      $("#stand-button").prop("disabled", false);
      if ((bet * 2) <= balance) {
        $("#double-button").prop("disabled", false);
      }
    }, 750);
    setTimeout(function() {
      dealFaceDown = false;
      dealerTotal = calculateTotal(dealersCards);

      // dont check for blackjack if the dealer got a blackjack because that would be a push
      if (dealerTotal !== 21) {
        // check if the player got a blackjack
        if (playerTotal === 21) {
          blackjack = true;
          $("#hit-button").prop("disabled", false);
          $("#stand-button").prop("disabled", false);
          win("You got a Blackjack!");
        }
      }
    }, 1000);
  }
}

function calculateTotal(cards) {
  /*
    Args:
        cards: the player or dealers hand
    Returns:
        total: the total of the player or dealers hand
    Purpose: to calculate the total of the player or dealers hand
*/
  let total = 0;
  let aces = 0;

  for (let i = 0; i < cards.length; i++) {
    let rank = cards[i].rank;
    if (rank === "A") {
      total += 11;
      aces += 1;
    }
    // if its a face card, add 10
    else if ("JQK".indexOf(rank) >= 0) {
      total += 10;
    } else {
      total += parseInt(rank);
    }
  }

  // If total is over 21 and there's an Ace, subtract 10 (making the Ace count as 1 instead of 11)
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function playAgain() {
  /* 
    Purpose: when user clicks play again, bring them back to the bet page
*/
  window.location.href = localStorage.getItem("path");
}

function doubleDown() {
  /*
    Purpose: if user clicks double down, double the user's bet and draw one more card
*/
  bet *= 2;
  $("#bet").text("Bet: " + bet);
  $("#double-button").prop("disabled", "disabled");
  hit();
  setTimeout(function() {
    if (playerTotal <= 21) 
      // prevents the program from having the dealer play if the player goes over 21
      {
      stand();
    }
  }, 250);
}

$(document).ready(function() {
  loadVariables();
  createDeck();
  shuffleArray(cards);
  deal();
  $("#hit-button").click(hit);
  $("#stand-button").click(stand);
  $(".play-again").click(playAgain);
  $("#double-button").click(doubleDown);
});
