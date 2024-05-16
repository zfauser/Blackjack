let balance = 100;
let bet = 0;
let validStartingValue = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
  // if the variables are in local storage, load them, otherwise set them to the default values
  if (localStorage.getItem("balance")) {
    balance = parseInt(localStorage.getItem("balance"));
    if (balance === 1) {
      $("#balance").text("Balance: " + balance + " Smartie");
    } else {
      $("#balance").text("Balance: " + balance + " Smarties");
    }
  } else {
    saveVariables();
  }
}

function onBetKeydown(e) {
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

function onBetKeyup(e)
/*
  Purpose When the user types in the bet input, this function checks if the input is empty, and it updates the balance
*/
{
  if (!$("#bet").val()) {
    $("#play-button").attr("disabled", "disabled");
  }
  bet = parseInt($("#bet").val()) || 0;
  newBalance = balance - bet;
  if (newBalance === 1) {
    $("#balance").text("Balance: " + newBalance + " Smartie");
  } else {
    $("#balance").text("Balance: " + newBalance + " Smarties");
  }
}

function onBetInput(e) 
/*
  Purpose When the user types in the bet input, this function checks if the input is empty, and it updates the balance
*/
{
    let tempBet = $("#bet").val();
    if (tempBet > balance || tempBet < 0 || tempBet == 0 || !validStartingValue.includes(parseInt(tempBet[0]))) {
        $("#play-button").attr("disabled", true);
    } else {
        $("#play-button").attr("disabled", false);
    }
}

function onBetInput()
/*
  Purpose: When the user change the bet input using the up and down arrows, this function updates the balance and checks if the bet is valid
*/
{
  bet = parseInt($("#bet").val()) || 0;
  newBalance = balance - bet;
  if (newBalance === 1) {
    $("#balance").text("Balance: " + newBalance + " Smartie");
  } else { 
    $("#balance").text("Balance: " + newBalance + " Smarties");
  }
  if (bet > 0 && bet <= balance) {
    $("#play-button").attr("disabled", false);
  } else {
    $("#play-button").attr("disabled", "disabled");
  }
}

function playButton() {
    saveVariables();
    window.location.href = "/game";
}

function resetButton() {
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
    $("#play-button").click(playButton)
    $("#reset-button").click(resetButton)
    if (balance <= 0) {
      $("#out-of-money-modal").modal({
        escapeClose: false,
        clickClose: false,
        showClose: false
      });
    }
});