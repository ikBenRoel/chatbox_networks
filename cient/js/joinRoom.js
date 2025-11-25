const joinButton = document.getElementById("join");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");

function validateInputs(username, room) {
  if (username.trim() === "" || room.trim() === "") {
    alert("Please enter your username or/and room.");
    return false;
  }
  return true;
}

function storeUserData(username, room) {
  localStorage.setItem("userName", username);
  localStorage.setItem("room", room);
}

function redirectToChatRoom() {
  window.location.href = "chatRoom.html";
}

function handleJoinButtonClick() {
  const username = usernameInput.value;
  const room = roomInput.value;

  if (!validateInputs(username, room)) return;

  storeUserData(username, room);
  redirectToChatRoom();
}

joinButton.addEventListener("click", handleJoinButtonClick);