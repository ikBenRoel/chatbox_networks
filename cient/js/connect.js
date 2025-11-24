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
  const data = JSON.parse(event.data);
  if (data.type === 'info') {
    div.textContent = `*** ${data.message} ***`;
    div.classList.add('info-message');
  } else if (data.type === 'Message'){
    div.textContent = `[${data.userName}]: ${data.message}`;
    if (data.userName === localStorage.getItem('username')) div.classList.add('my-message');
  }
  chatSpan.appendChild(div);
});

btn.addEventListener('click', () => {
  const msg = input.value;
  if (!msg) return;
  const data = {
    type: 'Message',
    message: msg,
    userName: localStorage.getItem('userName'),
    room: localStorage.getItem('room')
  }
  socket.send(msg);
  input.value = '';
});