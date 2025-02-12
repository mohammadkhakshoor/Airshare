const express = require("express");
const path = require("path");
const fs = require("fs");
const ip = require("ip");
const chalk = require("chalk");

function start(directory, port) {
  const app = express();

  // Middleware to enable CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

  // Serve static files from the current directory
  app.use("/files", express.static(directory));

  // Route to list directory contents
  app.get("/*", (req, res) => {
    // Get the requested directory path from the URL
    let requestedPath = req.path;
    if (requestedPath === "/") requestedPath = "";

    // Construct the full directory path
    const fullPath = path.join(directory, requestedPath);

    // Security check: Ensure the path is within the root directory
    if (!fullPath.startsWith(directory)) {
      return res.status(403).send("Access denied");
    }

    try {
      // Check if path exists and is accessible
      fs.accessSync(fullPath, fs.constants.R_OK);

      // Get directory contents
      const items = fs.readdirSync(fullPath);
      const files = items.map((item) => {
        const itemPath = path.join(fullPath, item);
        const stats = fs.statSync(itemPath);
        const relativePath = path.join(requestedPath, item);

        return {
          name: item,
          path: relativePath,
          isDirectory: stats.isDirectory(),
          size: stats.isDirectory() ? "-" : (stats.size / (1024 * 1024)).toFixed(2) + " MB",
          modified: stats.mtime.toLocaleDateString(),
        };
      });

      // Sort: directories first, then files, both alphabetically
      files.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      // Generate breadcrumb navigation
      const pathParts = requestedPath.split("/").filter(Boolean);
      const breadcrumbs = pathParts.map((part, index) => {
        const pathUpToHere = "/" + pathParts.slice(0, index + 1).join("/");
        return { name: part, path: pathUpToHere };
      });

      const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Directory Contents</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            max-width: 1000px; 
                            margin: 0 auto; 
                            padding: 20px;
                            background: #f5f5f5;
                        }
                        .container {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .breadcrumb {
                            display: flex;
                            align-items: center;
                            padding: 10px 0;
                            margin-bottom: 20px;
                            border-bottom: 1px solid #eee;
                        }
                        .breadcrumb a {
                            text-decoration: none;
                            color: #0066cc;
                            margin: 0 5px;
                        }
                        .breadcrumb span {
                            color: #666;
                            margin: 0 5px;
                        }
                        .file-list {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }
                        .file-item {
                            display: flex;
                            align-items: center;
                            padding: 12px;
                            border-bottom: 1px solid #eee;
                            transition: background-color 0.2s;
                        }
                        .file-item:hover {
                            background-color: #f8f8f8;
                        }
                        .file-icon {
                            margin-right: 10px;
                            font-size: 1.2em;
                        }
                        .file-name {
                            flex: 1;
                        }
                        .file-link {
                            text-decoration: none;
                            color: #0066cc;
                        }
                        .directory-link {
                            color: #333;
                            font-weight: 500;
                        }
                        .file-meta {
                            color: #666;
                            font-size: 0.9em;
                            margin-left: 20px;
                            min-width: 100px;
                            text-align: right;
                        }
                        .file-date {
                            color: #666;
                            font-size: 0.9em;
                            margin-left: 20px;
                            min-width: 100px;
                            text-align: right;
                        }
                        .empty-dir {
                            text-align: center;
                            padding: 40px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="breadcrumb">
                            <a href="/">🏠 Home</a>
                            ${breadcrumbs
                              .map(
                                (crumb, index) => `
                                <span>/</span>
                                <a href="${crumb.path}">${crumb.name}</a>
                            `
                              )
                              .join("")}
                        </div>
                        
                        ${
                          files.length === 0
                            ? `
                            <div class="empty-dir">
                                This folder is empty
                            </div>
                        `
                            : `
                            <ul class="file-list">
                                ${files
                                  .map(
                                    (file) => `
                                    <li class="file-item">
                                        <span class="file-icon">${file.isDirectory ? "📁" : "📄"}</span>
                                        <span class="file-name">
                                            ${
                                              file.isDirectory
                                                ? `<a href="${file.path}" class="file-link directory-link">${file.name}/</a>`
                                                : `<a href="/files${file.path}" class="file-link" download>${file.name}</a>`
                                            }
                                        </span>
                                        <span class="file-meta">${file.size}</span>
                                        <span class="file-date">${file.modified}</span>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ul>
                        `
                        }
                    </div>
                </body>
                </html>
            `;

      res.send(html);
    } catch (err) {
      res.status(404).send("Directory not found");
    }
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(chalk.green("\n🚀 File sharing server is running!\n"));
    console.log(`Local access:          ${chalk.cyan(`http://localhost:${port}`)}`);
    console.log(`On your network:       ${chalk.cyan(`http://${ip.address()}:${port}`)}\n`);
    console.log(chalk.yellow("Press Ctrl+C to stop the server\n"));
  });
}

module.exports = { start };
