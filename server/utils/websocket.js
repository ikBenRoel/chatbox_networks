const rateLimit = new Map();
const MAX_TOKENS = 5;
const REFILL_RATE = 1000;

function decodeMessage(buffer) {
  const secondByte = buffer[1];

  // Extract the payload length by ignoring the top MASK bit.
  const length = secondByte & 127; // actual payload length or indicator for extended length

  // Determine where the 4-byte MASK key starts. this depends on the length of the message
  let maskStart = 2;
  if (length === 126) maskStart = 4;
  if (length === 127) maskStart = 10;

  const mask = buffer.slice(maskStart, maskStart + 4);
  const messageStart = maskStart + 4;
  const message = buffer.slice(messageStart);

  // a buffer stores binary data
  const unmasked = Buffer.alloc(message.length);

  // The mask repeats every 4 bytes, so we use 'i % 4' to cycle through the key.
  for (let i = 0; i < message.length; i++) {
    unmasked[i] = message[i] ^ mask[i % 4];
  }

  return unmasked.toString();
}

function sendMessage(socket, msg) {
  const msgBuffer = Buffer.from(msg);
  const frame = Buffer.alloc(2 + msgBuffer.length);

  frame[0] = 129; // 10000001 (text)
  frame[1] = msgBuffer.length;
  msgBuffer.copy(frame, 2);

  socket.write(frame);
}

function isRateLimited(socket) {
  const now = Date.now();

  if (!rateLimit.has(socket)) {
    rateLimit.set(socket, { tokens: MAX_TOKENS, lastRefill: now });
    return false;
  }

  const data = rateLimit.get(socket);

  if (now - data.lastRefill >= REFILL_RATE) {
    data.tokens = MAX_TOKENS;
    data.lastRefill = now;
  }

  if (data.tokens <= 0) return true;

  data.tokens--;
  return false;
}

export { decodeMessage, sendMessage, isRateLimited};
