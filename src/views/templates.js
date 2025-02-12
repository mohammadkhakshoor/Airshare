const { getStyles } = require("./styles");

function renderDirectoryPage(files, breadcrumbs) {
  return `
    <!DOCTYPE html>
    <html data-theme="dark">
    <head>
        <title>Directory Contents</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${getStyles()}</style>
    </head>
    <body>
        <div class="container">
            ${renderHeader()}
            ${renderBreadcrumbs(breadcrumbs)}
            ${renderFileList(files)}
        </div>
        <script>
          // Theme handling
          const html = document.documentElement;
          const themeToggle = document.getElementById('theme-toggle');
          const themeIcon = document.getElementById('theme-icon');
          // Check for saved theme preference, otherwise use system preference
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
            updateThemeButton(savedTheme);
          } else {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            html.setAttribute('data-theme', systemTheme);
            updateThemeButton(systemTheme);
          }
          // Theme toggle handler
          themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
          });
          function updateThemeButton(theme) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
            themeToggle.setAttribute('aria-label', \`Switch to \${theme === 'dark' ? 'light' : 'dark'} theme\`);
          }
          // Listen for system theme changes
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
              const newTheme = e.matches ? 'dark' : 'light';
              html.setAttribute('data-theme', newTheme);
              updateThemeButton(newTheme);
            }
          });
        </script>
    </body>
    </html>
  `;
}

function renderHeader() {
  return `
    <div class="header">
      <div class="header-title">
        <a href="https://github.com/mohammadkhakshoor/local-share" class="github-link" target="_blank" aria-label="View on GitHub">
          <svg height="32" width="32" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
        <h1>Local Share</h1>
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
          <span id="theme-icon">🌙</span>
        </button>
      </div>
      <div class="header-actions">
        <form class="upload-form" id="upload-form" action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" id="file-input" class="file-input" multiple />
          <button type="submit" class="upload-button">
            <span>📤</span>
            Upload Files
          </button>
        </form>
      </div>
      <div id="upload-backdrop" class="upload-backdrop"></div>
      <button id="mobile-fab" class="mobile-fab hidden">
        <span>⬆️</span>
      </button>
      <div id="upload-container" class="upload-container minimized">
        <div class="upload-header">
          <h3>File Uploads</h3>
          <div class="upload-controls">
            <span class="upload-count" id="upload-count"></span>
            <button id="minimize-uploads" class="minimize-button" title="Toggle panel">
              <span class="minimize-icon">−</span>
            </button>
          </div>
        </div>
        <div id="uploads-list" class="uploads-list"></div>
      </div>
    </div>
    <script>
      document.getElementById('upload-form').addEventListener('submit', handleUpload);
      
      let activeUploads = new Map();
      let uploadCount = 0;
      
      function handleUpload(e) {
        e.preventDefault();
        const files = e.target.querySelector('input[type="file"]').files;
        
        // Show and maximize upload container
        const container = document.getElementById('upload-container');
        container.style.display = 'block';
        container.classList.remove('minimized');
        
        Array.from(files).forEach(file => {
          const uploadId = Date.now() + '-' + file.name;
          const uploadItem = createUploadItem(uploadId, file);
          document.getElementById('uploads-list').appendChild(uploadItem);
          uploadCount++;
          updateUploadCount();
          uploadFile(file, uploadId);
        });
        
        e.target.reset();
      }
      
      function createUploadItem(id, file) {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.id = id;
        item.innerHTML = \`
          <div class="upload-item-header">
            <span class="upload-filename">\${file.name}</span>
            <div class="upload-actions">
              <button class="cancel-button" onclick="cancelUpload('\${id}')">Cancel</button>
            </div>
          </div>
          <div class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="upload-stats">
              <span class="upload-percentage">0%</span>
              <span class="upload-speed">0 MB/s</span>
              <span class="upload-remaining">Calculating...</span>
            </div>
          </div>
        \`;
        return item;
      }

      function updateUploadCount() {
        const countElement = document.getElementById('upload-count');
        countElement.textContent = uploadCount > 0 ? \`\${uploadCount} upload\${uploadCount === 1 ? '' : 's'}\` : '';
        countElement.style.display = uploadCount > 0 ? 'block' : 'none';
      }

      // Add minimize/maximize functionality
      document.getElementById('minimize-uploads').addEventListener('click', () => {
        const container = document.getElementById('upload-container');
        container.classList.toggle('minimized');
        const button = document.querySelector('.minimize-icon');
        button.textContent = container.classList.contains('minimized') ? '+' : '−';
      });

      function uploadFile(file, uploadId) {
        const formData = new FormData();
        formData.append('file', file);
        
        const xhr = new XMLHttpRequest();
        const startTime = Date.now();
        let lastLoaded = 0;
        let lastTime = startTime;
        
        // Store upload controller
        activeUploads.set(uploadId, { xhr, status: 'uploading' });
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            const currentTime = Date.now();
            const timeDiff = (currentTime - lastTime) / 1000;
            const loadedDiff = e.loaded - lastLoaded;
            const speed = (loadedDiff / (1024 * 1024)) / timeDiff;
            const remaining = ((e.total - e.loaded) / (loadedDiff / timeDiff)) / 1000;
            
            updateUploadProgress(uploadId, {
              percent,
              speed,
              remaining,
              loaded: e.loaded,
              total: e.total
            });
            
            lastLoaded = e.loaded;
            lastTime = currentTime;
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            completeUpload(uploadId);
          } else {
            failUpload(uploadId);
          }
        });
        
        xhr.addEventListener('error', () => failUpload(uploadId));
        xhr.open('POST', '/upload');
        xhr.send(formData);
      }
      
      function updateUploadProgress(id, { percent, speed, remaining, loaded, total }) {
        const item = document.getElementById(id);
        if (!item) return;
        
        item.querySelector('.progress-fill').style.width = \`\${percent}%\`;
        item.querySelector('.upload-percentage').textContent = \`\${Math.round(percent)}%\`;
        item.querySelector('.upload-speed').textContent = \`\${speed.toFixed(1)} MB/s\`;
        item.querySelector('.upload-remaining').textContent = formatTime(remaining);
      }
      
      function cancelUpload(id) {
        const upload = activeUploads.get(id);
        if (upload && upload.status === 'uploading') {
          upload.xhr.abort();
          upload.status = 'cancelled';
          
          const item = document.getElementById(id);
          item.classList.add('upload-cancelled');
          item.querySelector('.upload-actions').innerHTML = \`
            <button class="delete-button" onclick="deleteUpload('\${id}')">Delete</button>
          \`;
        }
      }

      function deleteUpload(id) {
        const item = document.getElementById(id);
        item.classList.add('upload-item-removing');
        uploadCount--;
        updateUploadCount();
        
        // Remove after animation
        setTimeout(() => {
          item.remove();
          activeUploads.delete(id);
          
          if (document.getElementById('uploads-list').children.length === 0) {
            const container = document.getElementById('upload-container');
            container.classList.add('upload-container-hiding');
            setTimeout(() => {
              container.style.display = 'none';
              container.classList.remove('upload-container-hiding');
            }, 300);
          }
        }, 300);
      }
      
      function completeUpload(id) {
        const item = document.getElementById(id);
        item.classList.add('upload-complete');
        const actionsDiv = item.querySelector('.upload-actions');
        actionsDiv.innerHTML = '<span class="success-text">Completed</span>';
        setTimeout(() => deleteUpload(id), 3000);
      }
      
      function failUpload(id) {
        const item = document.getElementById(id);
        item.classList.add('upload-failed');
        item.querySelector('.upload-actions').innerHTML = \`
          <button class="delete-button" onclick="deleteUpload('\${id}')">Delete</button>
        \`;
      }
      
      function formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return 'Calculating...';
        if (seconds < 60) return \`\${Math.round(seconds)}s\`;
        const minutes = Math.floor(seconds / 60);
        seconds = Math.round(seconds % 60);
        return \`\${minutes}m \${seconds}s\`;
      }

      // Mobile-specific handling
      const isMobile = window.innerWidth <= 600;
      const fab = document.getElementById('mobile-fab');
      const backdrop = document.getElementById('upload-backdrop');
      const container = document.getElementById('upload-container');

      if (isMobile) {
        fab.classList.remove('hidden');
        
        fab.addEventListener('click', () => {
          container.style.display = 'block';
          container.classList.remove('minimized');
          backdrop.classList.add('visible');
          setTimeout(() => container.classList.add('visible'), 10);
        });

        backdrop.addEventListener('click', minimizePanel);
        
        function minimizePanel() {
          container.classList.add('minimized');
          backdrop.classList.remove('visible');
          setTimeout(() => {
            if (!document.getElementById('uploads-list').children.length) {
              container.style.display = 'none';
            }
          }, 300);
        }

        // Override existing minimize button behavior for mobile
        document.getElementById('minimize-uploads').addEventListener('click', minimizePanel);

        // Update handleUpload for mobile
        const originalHandleUpload = handleUpload;
        handleUpload = function(e) {
          originalHandleUpload(e);
          if (isMobile) {
            backdrop.classList.add('visible');
            container.classList.remove('minimized');
          }
        }

        // Update deleteUpload for mobile
        const originalDeleteUpload = deleteUpload;
        deleteUpload = function(id) {
          originalDeleteUpload(id);
          if (isMobile && !document.getElementById('uploads-list').children.length) {
            backdrop.classList.remove('visible');
          }
        }
      }

      // Handle window resize
      window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 600;
        if (newIsMobile !== isMobile) {
          location.reload();
        }
      });
    </script>
  `;
}

function renderBreadcrumbs(breadcrumbs) {
  return `

    <div class="breadcrumb">

      <a href="/">🏠 Home</a>

      ${breadcrumbs

        .map(
          (crumb) => `

          <span>/</span>

          <a href="${crumb.path}">${crumb.name}</a>

        `
        )

        .join("")}

    </div>

  `;
}

function renderFileList(files) {
  if (files.length === 0) {
    return `<div class="empty-dir">This folder is empty</div>`;
  }

  return `

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

          </li>

        `
        )

        .join("")}

    </ul>

  `;
}

module.exports = { renderDirectoryPage };
