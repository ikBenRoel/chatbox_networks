const http = require("http");
const crypto = require("crypto");
const {decodeMessage, sendMessage, addUser, removeSocket, broadcast} = require("./util.js");

const server = http.createServer();

const rooms = {};
const socketMap = new Map();

server.on("upgrade", (req, socket) => {
  if (req.headers["upgrade"] !== "websocket") {
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }


  const key = req.headers["sec-websocket-key"];
  const acceptKey = crypto
    .createHash("sha1")
    .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
    .digest("base64");

  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptKey}`
  ];

  socket.write(headers.join("\r\n") + "\r\n\r\n"); // insures a good formatting of the response


  socket.on("data", (buffer) => {
    try {
      const opcode = buffer[0] & 0x0f;
      if (opcode === 0x8) return; // client disconnects, ignore

      const data = JSON.parse(decodeMessage(buffer));

      if (data.type === "Message") {
        broadcast(rooms, data.room, data.message);
      } else if (data.type === "joinRoom") {
        const joinMsg = `${data.userName} has joined the room`;
        addUser(data.room, data.userName, socket, rooms, socketMap);
        broadcast(rooms, data.room, joinMsg, "info");
      }

    } catch (err) {
      console.error("Failed to decode message:", err);
    }
  });



  socket.on("end", () => removeSocket(socket, rooms, socketMap));
  socket.on("close", () => removeSocket(socket, rooms, socketMap));
  socket.on("error", () => removeSocket(socket, rooms, socketMap));


});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});