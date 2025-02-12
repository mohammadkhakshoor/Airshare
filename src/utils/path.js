const path = require("path");

const fs = require("fs");

const { renderDirectoryPage } = require("../views/templates");

function handleDirectoryRequest(req, res, directory) {
  let requestedPath = req.path;

  if (requestedPath === "/") requestedPath = "";

  const fullPath = path.join(directory, requestedPath);

  try {
    const files = getDirectoryContents(fullPath, requestedPath);

    const breadcrumbs = generateBreadcrumbs(requestedPath);

    res.send(renderDirectoryPage(files, breadcrumbs));
  } catch (err) {
    res.status(404).send("Directory not found");
  }
}

function getDirectoryContents(fullPath, requestedPath) {
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

  return files.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;

    if (!a.isDirectory && b.isDirectory) return 1;

    return a.name.localeCompare(b.name);
  });
}

function generateBreadcrumbs(requestedPath) {
  const pathParts = requestedPath.split("/").filter(Boolean);

  return pathParts.map((part, index) => {
    const pathUpToHere = "/" + pathParts.slice(0, index + 1).join("/");

    return { name: part, path: pathUpToHere };
  });
}

module.exports = { handleDirectoryRequest };
