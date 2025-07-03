const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");

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

  // Replace express.static with custom file serving middleware
  app.get("/files/*", (req, res) => {
    try {
      // Get the file path by removing '/files' prefix and normalize path
      const relativePath = decodeURIComponent(req.path.replace(/^\/files\//, "")).replace(/\\/g, "/");
      const filePath = path.join(directory, relativePath);

      // Security checks
      const realPath = fs.realpathSync(filePath);
      const realDirectory = fs.realpathSync(directory);

      if (!realPath.startsWith(realDirectory)) {
        return res.status(403).send("Access denied");
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
      }

      // Get file stats
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        return res.status(400).send("Not a file");
      }

      // Get proper MIME type and force binary for unknown types
      let mimeType = mime.lookup(filePath);
      if (!mimeType) {
        mimeType = "application/octet-stream";
      }

      // Set headers for download
      const fileName = path.basename(filePath);
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Type", mimeType);
      // Force download with original filename
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);

      // Disable caching
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        console.error("File stream error:", err);
        if (!res.headersSent) {
          res.status(500).send("Error streaming file");
        }
      });
    } catch (err) {
      console.error("File download error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error processing file download");
      }
    }
  });
}

module.exports = { setupMiddleware };
