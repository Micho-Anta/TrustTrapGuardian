import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const PORT = 5174;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT_DIR = path.resolve("docs/mobile-check");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log("🚀 Starting Vite server on port " + PORT + "...");
const viteProcess = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"]
});

viteProcess.stdout.on("data", (_d) => {
  // console.log("[vite]", _d.toString().trim());
});
viteProcess.stderr.on("data", (_d) => {
  // console.error("[vite err]", _d.toString().trim());
});

async function waitHttp(url, retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error("HTTP timeout for " + url);
}

async function waitServerReady(url, retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error("Vite server did not start in time");
}

let chromeProcess = null;
let tempDir = null;

try {
  await waitServerReady(`http://127.0.0.1:${PORT}/`);
  console.log("✅ Vite server is ready at http://127.0.0.1:" + PORT);

  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mobile-verify-"));
  console.log("🌐 Launching headless Chrome...");
  chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${tempDir}`,
    "--disable-gpu",
    "--window-size=1280,1024",
    `http://127.0.0.1:${PORT}/`
  ]);

  const tabs = await waitHttp("http://127.0.0.1:9222/json/list");
  const targetTab = tabs.find((t) => t.url.includes(String(PORT))) || tabs[0];
  console.log("Target tab connected:", targetTab.id, targetTab.url);

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("DOM.enable");

  // Wait for React hydration
  await new Promise((r) => setTimeout(r, 1500));

  async function evaluate(expression) {
    const res = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || "Eval error: " + expression);
    }
    return res.result.value;
  }

  async function captureScreenshot(filePath) {
    const res = await send("Page.captureScreenshot", {
      format: "png"
    });
    fs.writeFileSync(filePath, Buffer.from(res.data, "base64"));
    console.log(`  📸 Screenshot saved: ${path.basename(filePath)}`);
  }

  const widths = [320, 360, 390, 412, 768];
  const resultsTable = [];

  for (const w of widths) {
    console.log(`\n========================================`);
    console.log(`📱 TESTING VIEWPORT WIDTH: ${w}px`);
    console.log(`========================================`);

    await send("Emulation.setDeviceMetricsOverride", {
      width: w,
      height: 800,
      deviceScaleFactor: 1,
      mobile: w < 768
    });
    await new Promise((r) => setTimeout(r, 400));

    // ── KONDISI (a): Tab Recognize dengan hasil preset 1 sudah muncul ──
    console.log(`\n--- Kondisi (a): Tab Recognize + Preset 1 ---`);
    await evaluate(`
      (() => {
        const tab = [...document.querySelectorAll('button.tab-pill')].find(b => b.textContent.includes('Recognize'));
        if (tab) tab.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    // Click preset 1 button
    await evaluate(`
      (() => {
        const presetCards = document.querySelectorAll('.glass-card button');
        if (presetCards.length > 0) presetCards[0].click();
      })()
    `);
    // Wait for analysis
    await new Promise((r) => setTimeout(r, 800));

    const checkA_scroll = await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
    const checkA_overflow = await evaluate(`
      [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
        .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
    `);

    resultsTable.push({
      width: `${w}px`,
      condition: "(a) Recognize + Preset 1",
      scrollPass: checkA_scroll,
      overflowCount: checkA_overflow.length,
      overflowElements: checkA_overflow
    });

    if (w === 360) {
      await captureScreenshot(path.join(OUT_DIR, "tab1-recognize-360px.png"));
    }

    // ── KONDISI (b1): Tab Act dengan mode "Baru Terima Chat" + checklist ──
    console.log(`--- Kondisi (b1): Tab Act (Baru Terima Chat) ---`);
    await evaluate(`
      (() => {
        const tab = [...document.querySelectorAll('button.tab-pill')].find(b => b.textContent.includes('Act'));
        if (tab) tab.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    await evaluate(`
      (() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Baru Terima Chat'));
        if (btn) btn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    // Check steps
    await evaluate(`
      (() => {
        const steps = document.querySelectorAll('.select-none');
        if (steps[0]) steps[0].click();
        if (steps[1]) steps[1].click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    const checkB1_scroll = await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
    const checkB1_overflow = await evaluate(`
      [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
        .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
    `);

    resultsTable.push({
      width: `${w}px`,
      condition: "(b1) Act: Baru Terima Chat",
      scrollPass: checkB1_scroll,
      overflowCount: checkB1_overflow.length,
      overflowElements: checkB1_overflow
    });

    if (w === 360) {
      await captureScreenshot(path.join(OUT_DIR, "tab2-act-preventive-360px.png"));
    }

    // ── KONDISI (b2): Tab Act dengan mode "Terlanjur Klik / Transfer" + checklist ──
    console.log(`--- Kondisi (b2): Tab Act (Terlanjur Klik / Transfer) ---`);
    await evaluate(`
      (() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Terlanjur Klik'));
        if (btn) btn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    await evaluate(`
      (() => {
        const steps = document.querySelectorAll('.select-none');
        if (steps[0]) steps[0].click();
        if (steps[1]) steps[1].click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    const checkB2_scroll = await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
    const checkB2_overflow = await evaluate(`
      [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
        .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
    `);

    resultsTable.push({
      width: `${w}px`,
      condition: "(b2) Act: Terlanjur Klik / Transfer",
      scrollPass: checkB2_scroll,
      overflowCount: checkB2_overflow.length,
      overflowElements: checkB2_overflow
    });

    if (w === 360) {
      await captureScreenshot(path.join(OUT_DIR, "tab2-act-emergency-360px.png"));
    }

    // ── KONDISI (c): Kartu peringatan WhatsApp setelah scan ──
    console.log(`--- Kondisi (c): Kartu Peringatan WhatsApp ---`);
    await evaluate(`
      (() => {
        const wc = [...document.querySelectorAll('h2')].find(el => el.textContent.includes('Kartu Peringatan'));
        if (wc) wc.scrollIntoView();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    const checkC_scroll = await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
    const checkC_overflow = await evaluate(`
      [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
        .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
    `);

    resultsTable.push({
      width: `${w}px`,
      condition: "(c) Kartu Peringatan WhatsApp",
      scrollPass: checkC_scroll,
      overflowCount: checkC_overflow.length,
      overflowElements: checkC_overflow
    });

    if (w === 360) {
      await captureScreenshot(path.join(OUT_DIR, "tab2-act-warningcard-360px.png"));
    }

    // ── KONDISI (d): Tab Learn pada kuis dan kamus 10 pola ──
    console.log(`--- Kondisi (d): Tab Learn (Kuis & Kamus) ---`);
    await evaluate(`
      (() => {
        const tab = [...document.querySelectorAll('button.tab-pill')].find(b => b.textContent.includes('Learn'));
        if (tab) tab.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    // Click a quiz answer
    await evaluate(`
      (() => {
        const opt = document.querySelectorAll('button.border');
        if (opt.length > 0) opt[0].click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 300));

    const checkD1_scroll = await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
    const checkD1_overflow = await evaluate(`
      [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
        .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
    `);

    resultsTable.push({
      width: `${w}px`,
      condition: "(d1) Learn: Kuis Interaktif",
      scrollPass: checkD1_scroll,
      overflowCount: checkD1_overflow.length,
      overflowElements: checkD1_overflow
    });

    if (w === 360) {
      await captureScreenshot(path.join(OUT_DIR, "tab3-learn-quiz-360px.png"));
    }

    // Scroll to Threat Matrix
    await evaluate(`
      (() => {
        const matrix = [...document.querySelectorAll('h3')].find(el => el.textContent.includes('Kamus'));
        if (matrix) matrix.scrollIntoView();
      })()
    `);
    await new Promise((r) => setTimeout(r, 400));

    const checkD2_scroll = await evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
    const checkD2_overflow = await evaluate(`
      [...document.querySelectorAll('body *')]
        .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
        .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
    `);

    resultsTable.push({
      width: `${w}px`,
      condition: "(d2) Learn: Kamus Pola (Matrix)",
      scrollPass: checkD2_scroll,
      overflowCount: checkD2_overflow.length,
      overflowElements: checkD2_overflow
    });

    if (w === 360) {
      await captureScreenshot(path.join(OUT_DIR, "tab3-learn-matrix-360px.png"));
      // Also take overall view of Tab 3
      await captureScreenshot(path.join(OUT_DIR, "tab3-learn-360px.png"));
    }
  }

  console.log("\n=======================================================");
  console.log("📊 HASIL AKHIR VERIFIKASI MOBILE & DEVTOOLS CONSOLE:");
  console.log("=======================================================");
  console.table(
    resultsTable.map((r) => ({
      "Viewport Width": r.width,
      Kondisi: r.condition,
      "scrollWidth <= innerWidth": r.scrollPass ? "✅ TRUE" : "❌ FALSE",
      "Overflow Elements Count": r.overflowCount === 0 ? "✅ 0 (KOSONG)" : `❌ ${r.overflowCount}`,
      "Sample Overflow Element": r.overflowElements.slice(0, 2).join(" | ") || "NIHIL"
    }))
  );

  const allPassed = resultsTable.every((r) => r.scrollPass && r.overflowCount === 0);
  if (allPassed) {
    console.log("\n🎉 SELURUH KONDISI PADA SEMUA LEBAR LAYAR MEMENUHI SYARAT 100%!");
  } else {
    console.log("\n⚠️ PERHATIAN: Ditemukan elemen yang meluap pada pengujian!");
  }

  ws.close();
} catch (err) {
  console.error("❌ Verification error:", err);
} finally {
  if (chromeProcess) {
    chromeProcess.kill();
  }
  if (viteProcess) {
    viteProcess.kill();
  }
  if (tempDir) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
  console.log("🏁 Server and Chrome processes shut down cleanly.");
  process.exit(0);
}
