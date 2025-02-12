const express = require("express");
const multer = require("multer");
const path = require("path");

function setupMiddleware(app, directory) {
  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: directory,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  // Handle file uploads
  app.post("/upload", (req, res) => {
    let uploadProgress = 0;

    const uploadHandler = upload.single("file");

    req.on("data", (chunk) => {
      uploadProgress += chunk.length;
      // Calculate total from content-length header
      const total = parseInt(req.headers["content-length"]);
      const percent = (uploadProgress / total) * 100;
      // Send progress through SSE
      if (req.uploadEventEmitter) {
        req.uploadEventEmitter.emit("progress", { percent, uploaded: uploadProgress, total });
      }
    });

    uploadHandler(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
      res.json({
        success: true,
        file: {
          name: req.file.originalname,
          size: req.file.size,
          path: `/files${req.file.path.replace(directory, "")}`,
        },
      });
    });
  });

  // Handle upload progress events
  app.get("/upload-progress", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const uploadEventEmitter = new (require("events").EventEmitter)();
    req.uploadEventEmitter = uploadEventEmitter;

    uploadEventEmitter.on("progress", (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    req.on("close", () => {
      uploadEventEmitter.removeAllListeners();
    });
  });

  // Serve static files
  app.use("/files", express.static(directory));
}

module.exports = { setupMiddleware };
