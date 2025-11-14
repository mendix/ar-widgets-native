const fs = require('fs');
const path = require('path');

// Read dist directory and filter for version folders
const dirs = fs.readdirSync('./dist', { withFileTypes: true })
  .filter(d => d.isDirectory() && /^\d+\.\d+\.\d+$/.test(d.name));

if (!dirs.length) {
  console.log('No version folders found');
  process.exit(1);
}

// Sort versions properly using semantic versioning
const highest = dirs
  .map(d => ({
    name: d.name,
    version: d.name.split('.').map(Number)
  }))
  .sort((a, b) => 
    a.version[0] - b.version[0] || 
    a.version[1] - b.version[1] || 
    a.version[2] - b.version[2]
  )
  .pop();

// Set up source and destination paths
const src = path.join('./dist', highest.name);
const dest = '../Release/';

// Create destination directory if it doesn't exist
fs.mkdirSync(dest, { recursive: true });

// Copy all files from highest version folder to Release
fs.readdirSync(src).forEach(file => {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
});

console.log(`✅ Successfully copied version ${highest.name} to ${dest}`);