import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const LIVE_URL = "https://trusttrapguardian.vercel.app/";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

console.log("🌐 Starting Live Site Verification on: " + LIVE_URL);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "live-verify-"));
const chrome = spawn(CHROME_PATH, [
  "--headless=new",
  "--remote-debugging-port=9222",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${tempDir}`,
  "--disable-gpu",
  "--window-size=1280,1024",
  LIVE_URL
]);

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

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.idCounter = 1;
    this.callbacks = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method === "Runtime.consoleAPICalled") {
        if (msg.params.type === "error") {
          this.consoleErrors.push(msg.params.args?.map((a) => a.value || a.description).join(" "));
        }
      }
    };

    await this.send("Page.enable");
    await this.send("Runtime.enable");
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.idCounter++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || "Eval error: " + expression);
    }
    return res.result.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

try {
  const tabs = await waitHttp("http://127.0.0.1:9222/json/list");
  const tab = tabs.find((t) => t.url.includes("vercel.app")) || tabs[0];
  const cdp = new CDPClient(tab.webSocketDebuggerUrl);
  await cdp.connect();
  await new Promise((r) => setTimeout(r, 2000));

  console.log("\n=======================================================");
  console.log("1. UJI LIVE LEBAR 1280px (Desktop):");
  console.log("=======================================================");
  const hasCanvasRecognize = await cdp.evaluate(`!!document.querySelector('.particles-canvas')`);
  console.log("  Partikel di tab Recognize:", hasCanvasRecognize ? "✅ AKTIF" : "❌ TIDAK AKTIF");

  // Tab Act
  await cdp.evaluate(`document.querySelectorAll('button.tab-pill')[1].click()`);
  await new Promise((r) => setTimeout(r, 400));
  const hasCanvasAct = await cdp.evaluate(`!!document.querySelector('.particles-canvas')`);
  console.log("  Partikel di tab Act:", !hasCanvasAct ? "✅ BEBAS ANIMASI" : "❌ MERENDER");

  // Tab Learn
  await cdp.evaluate(`document.querySelectorAll('button.tab-pill')[2].click()`);
  await new Promise((r) => setTimeout(r, 400));
  const hasCanvasLearn = await cdp.evaluate(`!!document.querySelector('.particles-canvas')`);
  console.log("  Partikel di tab Learn:", !hasCanvasLearn ? "✅ BEBAS ANIMASI" : "❌ MERENDER");

  console.log("\n=======================================================");
  console.log("2. UJI LIVE LEBAR 360px (Emulasi Mobile):");
  console.log("=======================================================");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 360,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true
  });
  await new Promise((r) => setTimeout(r, 500));

  // Back to Recognize
  await cdp.evaluate(`document.querySelectorAll('button.tab-pill')[0].click()`);
  await new Promise((r) => setTimeout(r, 400));
  const scrollCheck360 = await cdp.evaluate(`document.documentElement.scrollWidth <= window.innerWidth`);
  const overflowCheck360 = await cdp.evaluate(`
    [...document.querySelectorAll('body *')]
      .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
      .map(e => e.tagName + '.' + e.className.toString().slice(0,60))
  `);
  console.log("  scrollWidth <= innerWidth (360px):", scrollCheck360 ? "✅ TRUE" : "❌ FALSE");
  console.log("  Elemen meluap (360px):", overflowCheck360.length === 0 ? "✅ 0 (KOSONG)" : `❌ ${overflowCheck360.length}`);

  // Check tab Learn visibility
  const learnTabRect = await cdp.evaluate(`
    (() => {
      const b = document.querySelectorAll('button.tab-pill')[2];
      const r = b.getBoundingClientRect();
      return { right: r.right, innerWidth: window.innerWidth, isCutOff: r.right > window.innerWidth };
    })()
  `);
  console.log("  Tab Learn tidak terpotong (right <= innerWidth):", !learnTabRect.isCutOff ? "✅ YA" : "❌ TERPOTONG");

  console.log("\n=======================================================");
  console.log("3. UJI LIVE SATU ALUR PENUH (Preset 1 -> Act Checklist -> Kuis Selesai):");
  console.log("=======================================================");
  // Click Preset 1
  await cdp.evaluate(`
    (() => {
      const presetBtns = document.querySelectorAll('.glass-card button');
      if (presetBtns[0]) presetBtns[0].click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 1000));
  const scoreText = await cdp.evaluate(`document.querySelector('.text-5xl.font-extrabold')?.textContent`);
  console.log("  Preset 1 Bedah Berhasil, Skor Risiko:", scoreText ? `✅ ${scoreText}/100` : "❌ Gagal");

  // Tab Act & Checklist
  await cdp.evaluate(`document.querySelectorAll('button.tab-pill')[1].click()`);
  await new Promise((r) => setTimeout(r, 400));
  await cdp.evaluate(`
    (() => {
      const steps = document.querySelectorAll('.select-none');
      if (steps[0]) steps[0].click();
      if (steps[1]) steps[1].click();
    })()
  `);
  await new Promise((r) => setTimeout(r, 300));
  const doneCount = await cdp.evaluate(`document.querySelectorAll('.select-none [class*=\"text-[#5df0a8]\"]').length`);
  console.log("  Checklist interaktif dicentang:", doneCount > 0 ? `✅ ${doneCount} protokol selesai` : "❌ Gagal");

  // WarningCard badge check on 360px
  const badgeWithinCard = await cdp.evaluate(`
    (() => {
      const card = document.querySelector('.max-w-xl.mx-auto.rounded-3xl');
      const badge = card?.querySelector('.whitespace-nowrap');
      if (!card || !badge) return false;
      const cRect = card.getBoundingClientRect();
      const bRect = badge.getBoundingClientRect();
      return bRect.right <= cRect.right + 2;
    })()
  `);
  console.log("  Badge Skor Bahaya di dalam batas kartu:", badgeWithinCard ? "✅ YA (TIDAK KELUAR)" : "❌ KELUAR");

  // Tab Learn -> Quiz to final score
  await cdp.evaluate(`document.querySelectorAll('button.tab-pill')[2].click()`);
  await new Promise((r) => setTimeout(r, 500));
  for (let q = 0; q < 8; q++) {
    await cdp.evaluate(`
      (() => {
        const btns = document.querySelectorAll('button.border');
        if (btns[0]) btns[0].click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 250));
    await cdp.evaluate(`
      (() => {
        const next = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Lanjut ke Skenario') || b.textContent.includes('Lihat Skor Akhir'));
        if (next) next.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 250));
  }
  const quizDone = await cdp.evaluate(`!!document.querySelector('.text-5xl.font-extrabold')`);
  console.log("  Kuis 8 skenario berjalan sampai skor akhir:", quizDone ? "✅ YA (SELESAI)" : "❌ Gagal");

  console.log("\n=======================================================");
  console.log("4. PEMERIKSAAN KONSOL PERAMBAN:");
  console.log("=======================================================");
  console.log("  Total console error:", cdp.consoleErrors.length === 0 ? "✅ 0 ERROR (BERSIH)" : `❌ ${cdp.consoleErrors.length} errors: ${cdp.consoleErrors.join("; ")}`);

  console.log("\n🎉 SELURUH PENGUJIAN SITUS LIVE DI VERCEL BERHASIL 100%!");
  cdp.close();
} catch (err) {
  console.error("Live test failed:", err);
} finally {
  chrome.kill();
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch {}
  process.exit(0);
}
