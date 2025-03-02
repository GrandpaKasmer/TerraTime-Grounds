const fs = require('fs');
const path = require('path');

console.log('Setting up NativeScript for StackBlitz...');

// Create a setup script
const setupScript = `
#!/usr/bin/env node

console.log('Setting up NativeScript environment for StackBlitz...');

// Create necessary directories
const dirs = [
  'node_modules/.bin',
  'node_modules/@nativescript/core',
  'node_modules/@nativescript/webpack',
  'node_modules/@nativescript/types-minimal'
];

dirs.forEach(dir => {
  if (!require('fs').existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true });
  }
});

// Create a mock ns command
const nsCommand = \`#!/usr/bin/env node
console.log('NativeScript CLI initialized in StackBlitz environment');
const args = process.argv.slice(2);

if (args[0] === 'preview') {
  console.log('Starting NativeScript preview...');
  require('../server.js');
} else {
  console.log('Command not supported in StackBlitz environment:', args.join(' '));
}
\`;

require('fs').writeFileSync('node_modules/.bin/ns', nsCommand);
require('fs').chmodSync('node_modules/.bin/ns', '755');

console.log('NativeScript environment setup complete!');
`;

fs.writeFileSync('setup-nativescript-stackblitz.js', setupScript);
fs.chmodSync('setup-nativescript-stackblitz.js', '755');

// Create a symlink for the command
try {
  if (!fs.existsSync('node_modules/.bin')) {
    fs.mkdirSync('node_modules/.bin', { recursive: true });
  }
  
  fs.writeFileSync('node_modules/.bin/setup-nativescript-stackblitz', '#!/usr/bin/env node\nrequire("../../setup-nativescript-stackblitz.js");');
  fs.chmodSync('node_modules/.bin/setup-nativescript-stackblitz', '755');
  
  console.log('NativeScript setup script created successfully!');
} catch (error) {
  console.error('Error creating NativeScript setup script:', error);
}