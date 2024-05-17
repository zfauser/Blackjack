let play = false;

function onPlaybuttonClick() {
    localStorage.setItem("path", "/bet");
    window.location.href = '/bet';
}

$(document).ready(function() {
    $('#play-button').click(onPlaybuttonClick);
});