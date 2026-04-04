import { readFileSync, writeFileSync } from 'fs';

const path = 'dist/eagami-ui/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));

delete pkg.pnpm;
delete pkg.packageManager;
delete pkg.dependencies?.tslib;

writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
