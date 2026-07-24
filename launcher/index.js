/**
 * Live Price Platform - Unified Launcher
 * 
 * Single application to manage all services.
 */

const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const open = require('child_process').exec;

const app = express();
const PORT = 9000;
const ROOT = path.join(__dirname, '..');

// Process management
let backendProc = null;
let frontendProc = null;
const logs = [];

function log(msg, type = 'info') {
  const entry = { time: new Date().toLocaleTimeString(), msg, type };
  logs.push(entry);
  if (logs.length > 200) logs.shift();
  console.log(`[${type.toUpperCase()}] ${msg}`);
}

function checkPort(port) {
  return new Promise(resolve => {
    const s = net.createServer();
    s.once('error', () => resolve(false));
    s.once('listening', () => { s.close(); resolve(true); });
    s.listen(port);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getStatus() {
  return {
    frontend: await checkPort(3100),
    backend: await checkPort(5100)
  };
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Status
app.get('/api/status', async (_, res) => {
  res.json({ ok: true, data: await getStatus() });
});

// API: Logs
app.get('/api/logs', (_, res) => {
  res.json({ ok: true, data: logs.slice(-50) });
});

// API: Start
app.post('/api/start', async (_, res) => {
  // Start backend
  if (!backendProc) {
    try {
      backendProc = spawn('npx', ['tsx', 'watch', 'src/index.ts'], {
        cwd: path.join(ROOT, 'backend'),
        env: { ...process.env, PORT: '5100', NODE_ENV: 'development' },
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      backendProc.stdout?.on('data', d => log(d.toString().trim()));
      backendProc.stderr?.on('data', d => log(d.toString().trim(), 'error'));
      backendProc.on('exit', () => { backendProc = null; log('Backend exited'); });
      log('Backend starting...');
    } catch(e) { log('Backend error: ' + e.message, 'error'); }
  }

  await sleep(2000);

  // Start frontend
  if (!frontendProc) {
    try {
      frontendProc = spawn('npx', ['next', 'dev', '-p', '3100'], {
        cwd: path.join(ROOT, 'frontend'),
        env: { ...process.env },
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      frontendProc.stdout?.on('data', d => log(d.toString().trim()));
      frontendProc.stderr?.on('data', d => log(d.toString().trim(), 'error'));
      frontendProc.on('exit', () => { frontendProc = null; log('Frontend exited'); });
      log('Frontend starting...');
    } catch(e) { log('Frontend error: ' + e.message, 'error'); }
  }

  await sleep(3000);
  res.json({ ok: true, data: await getStatus() });
});

// API: Stop
app.post('/api/stop', async (_, res) => {
  if (backendProc) { backendProc.kill(); backendProc = null; log('Backend stopped'); }
  if (frontendProc) { frontendProc.kill(); frontendProc = null; log('Frontend stopped'); }
  res.json({ ok: true, data: await getStatus() });
});

// API: Restart
app.post('/api/restart', async (_, res) => {
  if (backendProc) { backendProc.kill(); backendProc = null; }
  if (frontendProc) { frontendProc.kill(); frontendProc = null; }
  await sleep(1000);
  
  // Start backend
  try {
    backendProc = spawn('npx', ['tsx', 'watch', 'src/index.ts'], {
      cwd: path.join(ROOT, 'backend'),
      env: { ...process.env, PORT: '5100', NODE_ENV: 'development' },
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    backendProc.stdout?.on('data', d => log(d.toString().trim()));
    backendProc.stderr?.on('data', d => log(d.toString().trim(), 'error'));
    backendProc.on('exit', () => { backendProc = null; });
  } catch(e) { log('Backend error: ' + e.message, 'error'); }

  await sleep(2000);

  // Start frontend
  try {
    frontendProc = spawn('npx', ['next', 'dev', '-p', '3100'], {
      cwd: path.join(ROOT, 'frontend'),
      env: { ...process.env },
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    frontendProc.stdout?.on('data', d => log(d.toString().trim()));
    frontendProc.stderr?.on('data', d => log(d.toString().trim(), 'error'));
    frontendProc.on('exit', () => { frontendProc = null; });
  } catch(e) { log('Frontend error: ' + e.message, 'error'); }

  await sleep(3000);
  res.json({ ok: true, data: await getStatus() });
});

// Serve
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\nLauncher: http://localhost:${PORT}\n`);
  setTimeout(() => open(`start http://localhost:${PORT}`), 1500);
});
