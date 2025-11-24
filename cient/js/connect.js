const socket = new WebSocket('ws://127.0.0.1:3000');

const chatSpan = document.querySelector('#chat');
const input = document.querySelector('#msg');
const btn = document.querySelector('#sendBtn');

const joinRoomData = {
  type: 'joinRoom',
  userName: localStorage.getItem('userName'),
  room: localStorage.getItem('room')
}
socket.addEventListener('open', () => {
  socket.send(JSON.stringify(joinRoomData));
});

socket.addEventListener('message', (event) => {
  const div = document.createElement('div');
  div.textContent = event.data;
  chatSpan.appendChild(div);
});

btn.addEventListener('click', () => {
  const msg = input.value;
  if (!msg) return;
  data = {
    type: 'Message',
    message: msg,
    userName: localStorage.getItem('userName'),
    room: localStorage.getItem('room')
  }
  socket.send(msg);
  input.value = '';
});