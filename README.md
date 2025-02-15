# Local Share 🚀

A simple and elegant file-sharing server for your local network. Share files and directories with a beautiful, responsive web interface featuring dark/light theme support.

---

## Features ✨

- 🎯 **Zero Configuration**: Start sharing with a single command.
- 🌓 **Smart Theming**: Dark/Light mode with system preference detection.
- 📱 **Responsive Design**: Works seamlessly on all devices.
- 📂 **Easy Navigation**: Intuitive browsing with breadcrumbs.
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux.
- 🌐 **Network Sharing**: Access files from any device on your network.
- 📊 **File Details**: View size and modification date at a glance.

---

## Installation 📦

Install via npm:

```sh
npm install -g local-share
```

---

## Quick Start 🚀

### Share the current directory:

```sh
local-share
```

### Share a specific directory:

```sh
local-share ~/Documents
```

### Use a custom port (default: 3000):

```sh
local-share --port 8080
```

---

## Usage Guide 📖

### Command-Line Interface

```sh
Usage: local-share [directory] [options]

Arguments:
  directory               Directory to share (default: current directory)

Options:
  -V, --version          Output the version number
  -p, --port <number>    Port to run the server on (default: 3000)
  -h, --help             Display help information
```

## Features in Detail 🔍

### 🌑 Theme Support

- Automatic system theme detection.
- Manual theme toggle with persistent preference.
- Smooth transitions between themes.
- High contrast, accessible design.

### 📂 File Navigation

- Intuitive breadcrumb navigation.
- Clear file/folder distinction with icons.
- File size information in MB.
- Last modified date.
- Automatic sorting (folders first).
- Long filename truncation with ellipsis.

### 🌍 Network Access

- Automatic local IP detection.
- Easy-to-share network URLs.
- Cross-device compatibility.
- Zero configuration required.

---

## Browser Compatibility 🌐

Works with all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## Project Structure 📁

```
local-share/
├── bin/
│   └── cli.js         # Command-line interface
├── src/
│   ├── index.js       # Main entry point
│   ├── server/
│   │   ├── index.js   # Express server setup
│   │   └── middleware.js  # Express middleware
│   ├── utils/
│   │   └── path.js    # Path handling utilities
│   └── views/
│       ├── templates.js  # HTML templates
│       └── styles.js     # CSS styles
└── package.json
```

---

## Author ✨

**Mohammad Khakshoor**

- GitHub: [@mohammadkhakshoor](https://github.com/mohammadkhakshoor)
- npm: [local-share](https://www.npmjs.com/package/local-share)

---

## Support 💬

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/mohammadkhakshoor/local-share/issues).
2. Open a new issue if needed.
3. Include relevant details about your environment and use case.

---

## Changelog 📝

### Version 1.0.0

- Initial release.
- Feature-rich file-sharing server.
- Dark/Light theme support with system detection.
- Responsive design for all devices.
- Command-line interface.
- Programmatic API.

---

Enjoy seamless local file sharing with **Local Share**! 🚀
