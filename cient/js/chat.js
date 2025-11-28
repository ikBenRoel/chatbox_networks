import { getUsername, getRoom, appendMessage } from './utils.js';

const socket = new WebSocket('ws://127.0.0.1:3000');

const chatSpan = document.querySelector('#chat');
const input = document.querySelector('#msg');
const btn = document.querySelector('#sendBtn');

const roomName = getRoom(); 
document.querySelector('#room-title').textContent = `Room: ${roomName}`;

function createWhisperMessage(msg) {
  const parts = msg.split(' ');
  if (parts.length < 3) {
    appendMessage('Usage: /whisper <username> <message>', 'error-message');
    return null;
  }
  return {
    type: 'whisper',
    username: getUsername(),
    room: getRoom(),
    targetUser: parts[1],
    msg: parts.slice(2).join(' ')
  };
}

function createRegularMessage(msg) {
  return {
    type: 'Message',
    message: msg,
    username: getUsername(),
    room: getRoom()
  };
}

function handleSocketOpen() {
  socket.send(JSON.stringify({
    type: 'joinRoom',
    username: getUsername(),
    room: getRoom()
  }));
}

function handleSocketMessage(event) {
  const { type, username: sender, message, targetUser } = JSON.parse(event.data);
  console.log(event.data);
  switch (type) {
    case 'info':
      appendMessage(`*** ${message} ***`, 'info-message');
      break;
    case 'message':
      appendMessage(`[${sender}]: ${message}`, sender === getUsername() ? 'my-message' : 'message');
      break;
    case 'whisper':
      if (sender === getUsername()) appendMessage(`[Whisper to ${targetUser}]: ${message}`, 'my-message');
      else appendMessage(`[Whisper from ${sender}]: ${message}`, 'whisper-message');

      break;
    case 'error':
      appendMessage(`Error: ${message}`, 'error-message');
      break;
  }
}

function handleSendButtonClick() {
  const msg = input.value.trim();
  if (!msg) return;

  const isWhisper = msg.startsWith('/whisper ');
  const messageData = isWhisper ? createWhisperMessage(msg) : createRegularMessage(msg);

  if (messageData) {
    socket.send(JSON.stringify(messageData));
    input.value = '';
  }
}

socket.addEventListener('open', handleSocketOpen);
socket.addEventListener('message', handleSocketMessage);
btn.addEventListener('click', handleSendButtonClick);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendButtonClick();
});