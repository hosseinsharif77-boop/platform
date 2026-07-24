/**
 * Live Price Platform - Unified Launcher
 * 
 * A single application to manage all services.
 */

const express = require('express');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 9000;
const ROOT_DIR = path.join(__dirname, '..');

// Store processes
let backendProcess = null;
let frontendProcess = null;
let logs = [];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function log(message, type = 'info') {
  const entry = {
    time: new Date().toLocaleTimeString(),
    message,
    type
  };
  logs.push(entry);
  if (logs.length > 100) logs.shift();
}

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

async function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getStatus() {
  return {
    frontend: await checkPort(3100),
    backend: await checkPort(5100),
    mongodb: await checkPort(27017),
    redis: await checkPort(6379)
  };
}

// ===========================================
// API ROUTES
// ===========================================

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get status
app.get('/api/status', async (req, res) => {
  const status = await getStatus();
  res.json({ success: true, data: status });
});

// Get logs
app.get('/api/logs', (req, res) => {
  res.json({ success: true, data: logs.slice(-50) });
});

// Start services
app.post('/api/start', async (req, res) => {
  log('Starting all services...', 'info');
  
  // Start backend
  if (!backendProcess) {
    try {
      backendProcess = spawn('npx', ['tsx', 'src/index.ts'], {
        cwd: path.join(ROOT_DIR, 'backend'),
        env: { ...process.env, PORT: '5100', NODE_ENV: 'development' },
        shell: true,
        detached: true,
        stdio: 'ignore'
      });
      backendProcess.unref();
      log('Backend started on port 5100', 'success');
    } catch (e) {
      log('Failed to start backend: ' + e.message, 'error');
    }
  }

  // Wait for backend
  await sleep(2000);

  // Start frontend
  if (!frontendProcess) {
    try {
      frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(ROOT_DIR, 'frontend'),
        env: { ...process.env, PORT: '3100' },
        shell: true,
        detached: true,
        stdio: 'ignore'
      });
      frontendProcess.unref();
      log('Frontend started on port 3100', 'success');
    } catch (e) {
      log('Failed to start frontend: ' + e.message, 'error');
    }
  }

  const status = await getStatus();
  res.json({ success: true, data: status });
});

// Stop services
app.post('/api/stop', async (req, res) => {
  log('Stopping all services...', 'info');
  
  if (backendProcess) {
    try { backendProcess.kill(); } catch (e) {}
    backendProcess = null;
    log('Backend stopped', 'success');
  }

  if (frontendProcess) {
    try { frontendProcess.kill(); } catch (e) {}
    frontendProcess = null;
    log('Frontend stopped', 'success');
  }

  const status = await getStatus();
  res.json({ success: true, data: status });
});

// Restart services
app.post('/api/restart', async (req, res) => {
  log('Restarting services...', 'info');
  
  // Stop
  if (backendProcess) { try { backendProcess.kill(); } catch (e) {} backendProcess = null; }
  if (frontendProcess) { try { frontendProcess.kill(); } catch (e) {} frontendProcess = null; }
  
  await sleep(1000);
  
  // Start
  try {
    backendProcess = spawn('npx', ['tsx', 'src/index.ts'], {
      cwd: path.join(ROOT_DIR, 'backend'),
      env: { ...process.env, PORT: '5100', NODE_ENV: 'development' },
      shell: true,
      detached: true,
      stdio: 'ignore'
    });
    backendProcess.unref();
    log('Backend restarted', 'success');
  } catch (e) {
    log('Failed to restart backend: ' + e.message, 'error');
  }

  await sleep(2000);

  try {
    frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(ROOT_DIR, 'frontend'),
      env: { ...process.env, PORT: '3100' },
      shell: true,
      detached: true,
      stdio: 'ignore'
    });
    frontendProcess.unref();
    log('Frontend restarted', 'success');
  } catch (e) {
    log('Failed to restart frontend: ' + e.message, 'error');
  }

  const status = await getStatus();
  res.json({ success: true, data: status });
});

// Open URL
app.post('/api/open', (req, res) => {
  const { url } = req.body;
  const cmd = process.platform === 'win32' ? 'start' : 'open';
  exec(`${cmd} ${url}`);
  res.json({ success: true });
});

// Install dependencies
app.post('/api/install', async (req, res) => {
  log('Installing dependencies...', 'info');
  
  const runInstall = (dir) => {
    return new Promise((resolve) => {
      exec('npm install', { cwd: dir }, (err) => {
        if (err) {
          log('Error installing in ' + dir, 'error');
          resolve(false);
        } else {
          log('Dependencies installed in ' + path.basename(dir), 'success');
          resolve(true);
        }
      });
    });
  };

  await runInstall(ROOT_DIR);
  await runInstall(path.join(ROOT_DIR, 'backend'));
  await runInstall(path.join(ROOT_DIR, 'frontend'));
  await runInstall(path.join(ROOT_DIR, 'launcher'));

  log('All dependencies installed', 'success');
  res.json({ success: true });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===========================================
// START SERVER
// ===========================================

app.listen(PORT, () => {
  log('Launcher started', 'success');
  console.log('');
  console.log('='.repeat(50));
  console.log('  Live Price Platform - Launcher');
  console.log('='.repeat(50));
  console.log('');
  console.log(`  Control Panel: http://localhost:${PORT}`);
  console.log('');
  console.log('='.repeat(50));
  console.log('');

  // Auto-open browser
  const cmd = process.platform === 'win32' ? 'start' : 'open';
  setTimeout(() => {
    exec(`${cmd} http://localhost:${PORT}`);
  }, 1500);
});
