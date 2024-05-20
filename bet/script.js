/*
  Name: Zach Fauser
  Date: May 6th, 2024
  Purpose: allow user to bet on blackjack
  Repo: https://github.com/zfauser/Blackjack
*/
let balance = 100;
let bet = 0;
let validStartingValue = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let wins = 0;
let losses = 0;
let ties = 0;

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

function loadVariables() {
  /* 
  Purpose: To load the variables from local storage
*/
  // if the variables are in local storage, load them, otherwise set them to the default values
  if (localStorage.getItem("balance")) {
    balance = parseInt(localStorage.getItem("balance"));
    wins = parseInt(localStorage.getItem("wins"));
    losses = parseInt(localStorage.getItem("losses"));
    ties = parseInt(localStorage.getItem("ties"));
    if (balance === 1) {
      $("#balance").text(balance + " Smartie");
    } else {
      $("#balance").text(balance + " Smarties");
    }
    $('#bet').prop('max', balance);
    $("#wins").text(wins);
    $("#losses").text(losses);
    $("#pushes").text(ties);
  } else {
    saveVariables();
    localStorage.setItem("path", "/");
    window.location.href = localStorage.getItem("path");
  }

  if (localStorage.getItem("path")) {
    if (localStorage.getItem("path") != "/bet") {
      window.location.href = localStorage.getItem("path");
      console.log("redirected to " + localStorage.getItem("path"));
    }
  }
}

function onBetKeydown(e) {
  /*
  Purpose: When the user types in the bet input, this function checks to see if the key they pressed is a valid key, if it is not, it does not allow the key to be entered
*/
  if (
    e.key === "." ||
    e.key.toLowerCase() === "e" ||
    e.key === "-" ||
    e.key == "+"
  ) {
    return false;
  } else {
    let tempBet = $("#bet").val() + e.key;
    if (
      tempBet > balance ||
      tempBet < 0 ||
      tempBet == 0 ||
      !validStartingValue.includes(parseInt(tempBet[0]))
    ) {
      return false;
    } else {
      $("#play-button").attr("disabled", false);
    }
  }
}

function onBetKeyup(e) {
  /*
  Purpose When the user types in the bet input, this function checks if the input is empty, and it updates the balance
*/
  if (!$("#bet").val()) {
    $("#play-button").attr("disabled", "disabled");
  }
  bet = parseInt($("#bet").val()) || 0;
  newBalance = balance - bet;
  if (newBalance === 1) {
    $("#balance").text(newBalance + " Smartie");
  } else {
    $("#balance").text(newBalance + " Smarties");
  }
}

function onBetInput(e) {
  /*
  Purpose When the user types in the bet input, this function checks if the input is empty, and it updates the balance
*/
  let tempBet = $("#bet").val();
  if (
    tempBet > balance ||
    tempBet < 0 ||
    tempBet == 0 ||
    !validStartingValue.includes(parseInt(tempBet[0]))
  ) {
    $("#play-button").attr("disabled", true);
  } else {
    $("#play-button").attr("disabled", false);
  }
}

function onBetInput() {
  /*
  Purpose: When the user change the bet input using the up and down arrows, this function updates the balance and checks if the bet is valid
*/
  bet = parseInt($("#bet").val()) || 0;
  newBalance = balance - bet;
  if (newBalance === 1) {
    $("#balance").text(newBalance + " Smartie");
  } else {
    $("#balance").text(newBalance + " Smarties");
  }
  if (bet > 0 && bet <= balance) {
    $("#play-button").attr("disabled", false);
  } else {
    $("#play-button").attr("disabled", "disabled");
  }
}

function playButton() {
  /*
  Purpose; when the user clicks the play button, go to the game page
*/
  saveVariables();
  localStorage.setItem("path", "/game");
  window.location.href = "/game";
}

function resetButton() {
  /*
  Purpose: if the user is out of money a modal will show with a reset button, this function resets the balance to 100 when the reset button is clicked
*/
  balance = 100;
  saveVariables();
  $.modal.close();
  loadVariables();
}

$(document).ready(function() {
  loadVariables();
  $("#bet").keydown(onBetKeydown);
  $("#bet").keyup(onBetKeyup);
  $("#bet").on("input", onBetInput);
  $("#play-button").click(playButton);
  $("#reset-button").click(resetButton);

  // if the user is out of money show the out of money modal
  if (balance <= 0) {
    $("#out-of-money-modal").modal({
      escapeClose: false,
      clickClose: false,
      showClose: false,
    });
  }
});
