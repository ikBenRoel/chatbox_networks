import {sendFrame} from "./websocket.js";

function addUser(roomName, username, socket, rooms, socketMap) {
  if (!rooms[roomName]) rooms[roomName] = {};
  rooms[roomName][username] = socket;
  socketMap.set(socket, {roomName, username});
}

function removeSocket(socket, rooms, socketMap) {
  const info = socketMap.get(socket);
  if (!info) return false;

  const {roomName, username} = info;

  if (!rooms[roomName] || !rooms[roomName][username]) {
    return false;
  }

  delete rooms[roomName][username];
  socketMap.delete(socket);

  if (Object.keys(rooms[roomName]).length === 0) {
    delete rooms[roomName];
  }

  return true;
}

function sendMessage(rooms,roomName, targetUsername, type, msg,username) {
  const targetUserSocket = rooms[roomName][targetUsername];
  const data = {
    type,
    message: msg,
    username: username
  };
  sendFrame(targetUserSocket, JSON.stringify(data));
}

function broadcast(rooms, roomName, msg, username, type = "message") {
  const users = Object.keys(rooms[roomName] || {});
  if (!users.length) return;

  for (const targetUsername of users) {
    sendMessage(rooms, roomName, targetUsername, type, msg , username);
  }
}

function whisper(rooms, socket, data) {
  const {username, room, targetUser, msg} = data;
  if (!rooms[room] || !rooms[room][targetUser] || !rooms[room][username]){
    sendMessage(rooms, room, username, "error", `User ${targetUser} not found in room ${room}`, username);
    return;
  }
  sendMessage(rooms, room, targetUser, "whisper", msg, username);
  sendMessage(rooms, room, username, "whisper", msg, username);
}

export {addUser, removeSocket, broadcast, whisper,sendMessage};