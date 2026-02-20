const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing esbuild permissions...');

// Strategy 1: Find ALL esbuild binaries recursively using find command
try {
  const result = execSync('find node_modules -name "esbuild" -type f 2>/dev/null || true', { encoding: 'utf-8' });
  const files = result.trim().split('\n').filter(Boolean);
  files.forEach(file => {
    try {
      fs.chmodSync(file, 0o755);
      console.log('Fixed (find):', file);
    } catch (e) {
      console.log('Could not fix:', file, e.message);
    }
  });
} catch (e) {
  console.log('find command failed:', e.message);
}

// Strategy 2: Specifically target known pnpm paths
const patterns = [
  // Standard node_modules layout
  'node_modules/@esbuild/*/bin/esbuild',
  'node_modules/esbuild/bin/esbuild',
  'node_modules/.bin/esbuild',
  // pnpm hoisted layout
  'node_modules/pnpm/@esbuild+linux-x64@*/node_modules/@esbuild/linux-x64/bin/esbuild',
  'node_modules/pnpm/@esbuild+linux-arm64@*/node_modules/@esbuild/linux-arm64/bin/esbuild',
  'node_modules/.pnpm/@esbuild+linux-x64@*/node_modules/@esbuild/linux-x64/bin/esbuild',
  'node_modules/.pnpm/@esbuild+linux-arm64@*/node_modules/@esbuild/linux-arm64/bin/esbuild',
  'node_modules/.pnpm/esbuild@*/node_modules/esbuild/bin/esbuild',
];

// Use glob-like approach with execSync
patterns.forEach(pattern => {
  try {
    const result = execSync(`ls ${pattern} 2>/dev/null || true`, { encoding: 'utf-8' });
    const files = result.trim().split('\n').filter(Boolean);
    files.forEach(file => {
      try {
        fs.chmodSync(file, 0o755);
        console.log('Fixed (pattern):', file);
      } catch (e) {
        console.log('Could not fix:', file, e.message);
      }
    });
  } catch (e) {
    // ignore
  }
});

// Strategy 3: chmod +x everything that looks like an esbuild binary
try {
  execSync('chmod +x node_modules/.bin/esbuild 2>/dev/null || true');
  execSync('find node_modules -path "*/bin/esbuild" -exec chmod +x {} \\; 2>/dev/null || true');
  execSync('find node_modules -path "*/@esbuild/*/bin/esbuild" -exec chmod +x {} \\; 2>/dev/null || true');
  execSync('find node_modules -name "esbuild" -path "*/bin/*" -exec chmod +x {} \\; 2>/dev/null || true');
  console.log('Applied chmod +x to all esbuild binaries via find');
} catch (e) {
  console.log('chmod strategy failed:', e.message);
}

console.log('esbuild permission fix complete!');
