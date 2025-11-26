function getUsername() {
  return localStorage.getItem('username');
}

function getRoom() {
  return localStorage.getItem('room');
}

function appendMessage(content, className) {
  const chatSpan = document.querySelector('#chat');
  const div = document.createElement('div');
  div.textContent = content;
  console.log(className);
  div.classList.add(className);
  chatSpan.appendChild(div);
}

export {getUsername, getRoom, appendMessage};
