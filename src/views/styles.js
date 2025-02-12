function getStyles() {
  return `
    :root {
      --bg-main: #000;
      --bg-container: #111111;
      --border-color: #333;
      --text-primary: #fff;
      --text-secondary: #888;
      --link-color: #3291ff;
      --link-hover: #69b4ff;
      --item-hover: #1a1a1a;
    }

    :root[data-theme="light"] {
      --bg-main: #f5f5f5;
      --bg-container: #ffffff;
      --border-color: #eaeaea;
      --text-primary: #000;
      --text-secondary: #666;
      --link-color: #0070f3;
      --link-hover: #0761d1;
      --item-hover: #f5f5f5;
    }

    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 1000px; 
      margin: 0 auto;
      padding: 10px;
      background: var(--bg-main);
      transition: background-color 0.3s ease;
    }
    .container {
      background: var(--bg-container);
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border: 1px solid var(--border-color);
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .header-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 8px;
    }

    .header h1 {
      color: var(--text-primary);
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      background: linear-gradient(45deg, var(--link-color), var(--link-hover));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .github-link {
      color: var(--text-secondary);
      transition: color 0.2s;
      display: flex;
      align-items: center;
    }

    .github-link:hover {
      color: var(--text-primary);
    }

    .github-link svg {
      transition: transform 0.2s;
    }

    .github-link:hover svg {
      transform: scale(1.1);
    }

    .theme-toggle {
      background: var(--bg-main);
      border: 1px solid var(--border-color);
      padding: 10px;
      border-radius: 50%;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      width: 40px;
      height: 40px;
    }

    .theme-toggle:hover {
      border-color: var(--link-color);
      color: var(--link-color);
      transform: rotate(15deg);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .upload-form {
      flex: 1;
      min-width: 280px;
      display: flex;
      gap: 12px;
      background: var(--bg-main);
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      transition: border-color 0.2s;
    }

    .upload-form:focus-within {
      border-color: var(--link-color);
    }

    .file-input {
      flex: 1;
      color: var(--text-primary);
      font-size: 14px;
      background: none;
      border: none;
      outline: none;
      padding: 8px;
    }

    .file-input::file-selector-button {
      background: var(--bg-container);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      margin-right: 16px;
    }

    .file-input::file-selector-button:hover {
      background: var(--link-color);
      border-color: var(--link-color);
      color: white;
    }

    .upload-button {
      background: var(--link-color);
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .upload-button:hover {
      background: var(--link-hover);
      transform: translateY(-1px);
    }

    .upload-button:active {
      transform: translateY(0);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      padding: 10px 0;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      font-size: 14px;
    }
    .breadcrumb a {
      text-decoration: none;
      color: var(--link-color);
      margin: 0 5px;
      transition: color 0.2s;
    }
    .breadcrumb a:hover {
      color: var(--link-hover);
    }
    .breadcrumb span {
      color: var(--text-secondary);
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
      border-bottom: 1px solid var(--border-color);
      transition: background-color 0.2s;
    }
    .file-item:hover {
      background-color: var(--item-hover);
    }
    .file-icon {
      margin-right: 12px;
      font-size: 1.2em;
      color: var(--text-secondary);
    }
    .file-name {
      flex: 1;
      min-width: 0;
    }
    .file-link {
      text-decoration: none;
      color: var(--link-color);
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.2s;
    }
    .file-link:hover {
      color: var(--link-hover);
    }
    .directory-link {
      color: var(--text-primary);
      font-weight: 500;
    }
    .file-meta {
      color: var(--text-secondary);
      font-size: 0.9em;
      margin-left: 20px;
      min-width: 100px;
      text-align: right;
    }
    .empty-dir {
      text-align: center;
      padding: 40px;
      color: var(--text-secondary);
    }

    .upload-progress {
      margin-top: 10px;
      width: 100%;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      width: 0%;
      height: 100%;
      background: var(--link-color);
      transition: width 0.2s ease;
    }

    .progress-text {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 4px;
      text-align: center;
    }

    @media (max-width: 600px) {
      .header {
        gap: 16px;
      }

      .header-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      
      .upload-form {
        flex-direction: column;
        min-width: unset;
      }

      .theme-toggle {
        align-self: flex-end;
      }

      .header-title {
        padding: 0;
      }

      .github-link svg {
        height: 28px;
        width: 28px;
      }

      .theme-toggle {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }
    }

    .upload-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      background: var(--bg-container);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-color);
      z-index: 1000;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: bottom right;
    }

    .upload-container.minimized {
      transform: translateY(calc(100% - 48px));
      border-radius: 12px 12px 0 0;
    }

    .upload-container.upload-container-hiding {
      transform: translateY(100%);
      opacity: 0;
    }

    .upload-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--bg-main);
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
    }

    .upload-header h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 16px;
      font-weight: 600;
    }

    .upload-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .upload-count {
      font-size: 12px;
      color: var(--text-secondary);
      background: var(--border-color);
      padding: 2px 8px;
      border-radius: 12px;
    }

    .minimize-button {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .minimize-button:hover {
      background: var(--border-color);
      color: var(--text-primary);
    }

    .uploads-list {
      max-height: 400px;
      overflow-y: auto;
      padding: 8px;
    }

    .upload-item {
      background: var(--bg-main);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }

    .upload-item-removing {
      transform: translateX(100%);
      opacity: 0;
    }

    .upload-cancelled {
      border-left: 3px solid #ff9800;
      opacity: 0.8;
    }

    .progress-bar {
      height: 6px;
      background: var(--border-color);
      border-radius: 3px;
      overflow: hidden;
      margin: 8px 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--link-color), var(--link-hover));
      transition: width 0.3s ease;
    }

    .upload-stats {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
      font-size: 11px;
      margin-top: 4px;
    }

    .delete-button {
      background: #ff4444;
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .delete-button:hover {
      background: #ff6666;
      transform: translateY(-1px);
    }

    .mobile-fab {
      display: none;
    }

    @media (max-width: 600px) {
      .upload-container {
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 16px 16px 0 0;
        border-bottom: none;
        max-height: 80vh;
      }

      .upload-container.minimized {
        transform: translateY(100%);
      }

      .mobile-fab {
        display: flex;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--link-color);
        color: white;
        border: none;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 999;
      }

      .mobile-fab.hidden {
        transform: scale(0);
        opacity: 0;
      }

      .upload-header {
        padding: 16px;
      }

      .upload-controls {
        gap: 16px;
      }

      .minimize-button {
        width: 32px;
        height: 32px;
        font-size: 20px;
      }

      .uploads-list {
        max-height: calc(80vh - 60px);
        padding: 12px;
      }

      .upload-item {
        margin-bottom: 12px;
      }

      /* Add backdrop when modal is open */
      .upload-backdrop {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .upload-backdrop.visible {
        display: block;
        opacity: 1;
      }
    }
  `;
}

module.exports = { getStyles };
