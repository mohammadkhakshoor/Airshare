const { createServer } = require("./server");

function start(directory, port) {
  createServer(directory, port);
}

module.exports = { start };
