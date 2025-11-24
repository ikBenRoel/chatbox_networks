document.getElementById("join").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const room = document.getElementById("room").value;

  if (username.trim() === "" || room.trim() === "") {
    alert("Please enter your username or/and room.");
    return;
  }
  localStorage.setItem("userName", username);
  localStorage.setItem("room", room);
  window.location.href = "chatRoom.html";
});