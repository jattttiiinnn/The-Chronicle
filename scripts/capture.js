import { spawn } from 'child_process';
import fs from 'fs';

async function capture() {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const port = 9222;

  // 1. Launch Chrome with remote debugging
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check'
  ]);

  // Give Chrome 1 second to start
  await new Promise(r => setTimeout(r, 1200));

  try {
    // 2. Get WebSocket debugger URL from Chrome JSON version endpoint
    const versionRes = await fetch(`http://127.0.0.1:${port}/json/version`);
    const versionData = await versionRes.json();
    const browserWsUrl = versionData.webSocketDebuggerUrl;

    const scenarios = [
      { name: 'styleguide-light', theme: 'light', width: 1280, height: 1600 },
      { name: 'styleguide-dark', theme: 'dark', width: 1280, height: 1600 },
      { name: 'styleguide-mobile', theme: 'light', width: 390, height: 844 }
    ];

    for (const sc of scenarios) {
      // Create a new target/page
      const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://127.0.0.1:5173/styleguide`, { method: 'PUT' });
      const target = await newTabRes.json();
      const ws = new WebSocket(target.webSocketDebuggerUrl);

      await new Promise((resolve) => {
        let id = 1;
        const send = (method, params = {}) => {
          ws.send(JSON.stringify({ id: id++, method, params }));
        };

        ws.onopen = async () => {
          send('Page.enable');
          send('Emulation.setDeviceMetricsOverride', {
            width: sc.width,
            height: sc.height,
            deviceScaleFactor: 1,
            mobile: sc.width < 500
          });

          if (sc.theme === 'dark') {
            send('Emulation.setEmulatedMedia', {
              media: 'screen',
              features: [{ name: 'prefers-color-scheme', value: 'dark' }]
            });
          } else {
            send('Emulation.setEmulatedMedia', {
              media: 'screen',
              features: [{ name: 'prefers-color-scheme', value: 'light' }]
            });
          }

          // Wait 2.5 seconds for React lazy chunk to load and render
          await new Promise(r => setTimeout(r, 2500));

          // Also execute script to ensure theme class is set
          if (sc.theme === 'dark') {
            send('Runtime.evaluate', { expression: "document.documentElement.classList.add('dark'); localStorage.setItem('chronicle-theme', 'dark');" });
          } else {
            send('Runtime.evaluate', { expression: "document.documentElement.classList.remove('dark'); localStorage.setItem('chronicle-theme', 'light');" });
          }

          await new Promise(r => setTimeout(r, 500));

          // Capture screenshot
          send('Page.captureScreenshot', { format: 'png' });
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.result && msg.result.data) {
            fs.mkdirSync('screenshots', { recursive: true });
            fs.writeFileSync(`screenshots/${sc.name}.png`, Buffer.from(msg.result.data, 'base64'));
            console.log(`Captured screenshots/${sc.name}.png (${sc.width}x${sc.height}, theme: ${sc.theme})`);
            ws.close();
            resolve();
          }
        };
      });

      // Close target
      await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
    }
  } finally {
    chrome.kill();
  }
}

capture().catch(console.error);
