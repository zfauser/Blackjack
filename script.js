/*
  Name: Zach Fauser
  Date: May 6th, 2024
  Purpose: handle the home page for the blackjack game
*/
let play = false;

function playButton() {
  /*
    purpose: when user clicks play button, go to the bet page
*/
  localStorage.setItem("path", "/bet");
  localStorage.setItem("balance", 100);
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
  $("#instructions").hide();
  $("#play-button").click(playButton);
  $("#instructions-button").click(instructionsButton);
});
