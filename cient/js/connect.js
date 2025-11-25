const socket = new WebSocket('ws://127.0.0.1:3000');

const chatSpan = document.querySelector('#chat');
const input = document.querySelector('#msg');
const btn = document.querySelector('#sendBtn');

const userName = localStorage.getItem('userName');
const room = localStorage.getItem('room');

function appendMessage(content, className = '') {
  const div = document.createElement('div');
  div.textContent = content;
  if (className) div.classList.add(className);
  chatSpan.appendChild(div);
}

function handleSocketOpen() {
  const joinRoomData = {
    type: 'joinRoom',
    userName,
    room
  };
  socket.send(JSON.stringify(joinRoomData));
}

function handleSocketMessage(event) {
  const data = JSON.parse(event.data);

  if (data.type === 'info') {
    appendMessage(`*** ${data.message} ***`, 'info-message');
  } else if (data.type === 'Message') {
    const messageContent = `[${data.userName}]: ${data.message}`;
    const className = data.userName === userName ? 'my-message' : '';
    appendMessage(messageContent, className);
  }
}

function handleSendButtonClick() {
  const msg = input.value.trim();
  if (!msg) return;

  const messageData = {
    type: 'Message',
    message: msg,
    userName,
    room
  };

  socket.send(JSON.stringify(messageData));
  input.value = '';
}

socket.addEventListener('open', handleSocketOpen);
socket.addEventListener('message', handleSocketMessage);
btn.addEventListener('click', handleSendButtonClick);