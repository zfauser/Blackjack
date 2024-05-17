let play = false;

function playButton() {
    localStorage.setItem("path", "/bet");
    localStorage.setItem("balance", 100);
    window.location.href = '/bet';
}

function instructionsButton() {
    $('#instructions').slideToggle();
    if ($('#instructions-button').text() === 'Show Instructions') {
        $('#instructions-button').text('Hide Instructions');
    } else {
        $('#instructions-button').text('Show Instructions');
    }
}

$(document).ready(function() {
    $('#instructions').hide();
    $('#play-button').click(playButton);
    $('#instructions-button').click(instructionsButton);
});