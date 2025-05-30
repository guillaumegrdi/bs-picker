const nameContainer = document.getElementById("nameContainer");
const playerName = localStorage.getItem("playerName");

nameContainer.innerHTML = `${playerName}`;
