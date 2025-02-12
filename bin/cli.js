#!/usr/bin/env node

const { program } = require('commander');
const { start } = require('../src/index');
const path = require('path');
const chalk = require('chalk');
const packageJson = require('../package.json');

program
  .name('local-share')
  .description('A simple and elegant file sharing server for local network')
  .version(packageJson.version)
  .argument('[directory]', 'directory to share (defaults to current directory)')
  .option('-p, --port <number>', 'port to run the server on', '3000')
  .addHelpText('after', `
Example usage:
  $ local-share                    # Share current directory on port 3000
  $ local-share ~/Documents        # Share specific directory
  $ local-share . --port 8080     # Use custom port
  $ local-share -h                 # Show help
  `)
  .action((directory, options) => {
    const targetDir = directory ? path.resolve(directory) : process.cwd();
    const port = parseInt(options.port);

    if (isNaN(port) || port < 0 || port > 65535) {
      console.error(chalk.red('Error: Port must be a number between 0 and 65535'));
      process.exit(1);
    }

    start(targetDir, port);
  });

program.parse();
