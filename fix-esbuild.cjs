const fs = require('fs');
const path = require('path');

// Fix @esbuild platform-specific binaries
const esbuildDir = path.join('node_modules', '@esbuild');
if (fs.existsSync(esbuildDir)) {
  fs.readdirSync(esbuildDir).forEach(folder => {
    const bin = path.join(esbuildDir, folder, 'bin', 'esbuild');
    if (fs.existsSync(bin)) {
      fs.chmodSync(bin, 0o755);
      console.log('Fixed permissions:', bin);
    }
  });
}

// Fix .bin/esbuild
const dotBin = path.join('node_modules', '.bin', 'esbuild');
if (fs.existsSync(dotBin)) {
  fs.chmodSync(dotBin, 0o755);
  console.log('Fixed permissions:', dotBin);
}

// Fix esbuild/bin/esbuild
const esbuildBin = path.join('node_modules', 'esbuild', 'bin', 'esbuild');
if (fs.existsSync(esbuildBin)) {
  fs.chmodSync(esbuildBin, 0o755);
  console.log('Fixed permissions:', esbuildBin);
}

console.log('esbuild permissions fixed!');
