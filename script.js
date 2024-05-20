/*
  Name: Zach Fauser
  Date: May 6th, 2024
  Purpose: handle the home page for the blackjack game
*/
let play = false;
let balance = 100;
let wins = 0;
let losses = 0;
let ties = 0;

function loadVariables() {
  /* 
  Purpose: To load the variables from local storage
*/
  if (localStorage.getItem("balance")) {
    balance = parseInt(localStorage.getItem("balance"));
    wins = parseInt(localStorage.getItem("wins"));
    losses = parseInt(localStorage.getItem("losses"));
    ties = parseInt(localStorage.getItem("ties"));
    if (localStorage.getItem("balance")) {
      balance = parseInt(localStorage.getItem("balance"));
      if (balance === 1) {
        $("#balance").text(balance + " Smartie");
      } else {
        $("#balance").text(balance + " Smarties");
      }
    }
    $("#wins").text(wins);
    $("#losses").text(losses);
    $("#pushes").text(ties);
  } else {
    balance = 100;
    saveVariables();
    localStorage.setItem("path", "/");
    window.location.href = localStorage.getItem("path");
  }

  if (localStorage.getItem("path")) {
    // if the user has a game in progress, redirect them there
    if (localStorage.getItem("path") === "/game") {
      // put them back on the page they are supposed to be on
      window.location.href = localStorage.getItem("path");
    }
  }
}

function saveVariables() {
  /*
  Purpose: To save the variables to local storage, which allows them to be saved between sessions
*/
  localStorage.setItem("balance", balance);
  localStorage.setItem("wins", wins);
  localStorage.setItem("losses", losses);
  localStorage.setItem("ties", ties);
}

function playButton() {
  /*
    purpose: when user clicks play button, go to the bet page
*/
  localStorage.setItem("path", "/bet");
  window.location.href = "/bet";
}

function instructionsButton() {
  /*
    Purpose: if user clicks instructions button, show or hide instructions
*/
  $("#instructions").slideToggle();
  if ($("#instructions-button").text() === "Show Instructions") {
    $("#instructions-button").text("Hide Instructions");
  } else {
    $("#instructions-button").text("Show Instructions");
  }
}

$(document).ready(function() {
  loadVariables();
  $("#instructions").hide();
  $("#play-button").click(playButton);
  $("#instructions-button").click(instructionsButton);
});
