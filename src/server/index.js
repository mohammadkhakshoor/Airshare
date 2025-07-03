const express = require("express");
const ip = require("ip");
const chalk = require("chalk");
const { setupMiddleware } = require("./middleware");
const { handleDirectoryRequest } = require("../utils/path");
const { renderUnicodeCompact: renderQRCode } = require("uqr");

function createServer(directory, port) {
  const app = express();

  // Setup middleware
  setupMiddleware(app, directory);

  // Route to list directory contents
  app.get("/*", (req, res) => handleDirectoryRequest(req, res, directory));

  // Start server
  app.listen(port, "0.0.0.0", () => {
    console.log(renderQRCode(`http://${ip.address()}:${port}`)),
    console.log(chalk.green("\n🚀 File sharing server is running!\n"));
    console.log(`Local access:          ${chalk.cyan(`http://localhost:${port}`)}`);
    console.log(`On your network:       ${chalk.cyan(`http://${ip.address()}:${port}`)}\n`);
    console.log(chalk.yellow("Press Ctrl+C to stop the server\n"));
  });

  return app;
}

module.exports = { createServer };
