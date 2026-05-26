const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'tab2', 'tab2.page.html'), 'utf8');
const texts = new Set();

// Extract all text from .ar-text spans, stripping speaker prefix
const regex = /ar-text[^>]*>([^<]+)<\/span>/g;
let m;
while ((m = regex.exec(html)) !== null) {
  let t = m[1].replace(/^[^:]+:\s*/, '').trim();
  if (t) texts.add(t);
}

const outDir = path.join(__dirname, '..', 'src', 'assets', 'audio');
fs.mkdirSync(outDir, { recursive: true });

const mapping = {};
let i = 0;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const f = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(f);
      f.on('finish', () => { f.close(); resolve(); });
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

(async () => {
  for (const t of texts) {
    const hash = crypto.createHash('md5').update(t).digest('hex').substring(0, 8);
    const dest = path.join(outDir, `${hash}.mp3`);
    const q = encodeURIComponent(t.substring(0, 200));
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=ar&client=tw-ob`;
    
    if (!fs.existsSync(dest)) {
      try {
        await download(url, dest);
        console.log(`[${++i}/${texts.size}] OK ${hash} - ${t.substring(0, 40)}`);
      } catch (e) {
        console.log(`[${++i}/${texts.size}] FAIL ${hash} - ${t.substring(0, 40)}`);
        continue;
      }
    } else {
      console.log(`[${++i}/${texts.size}] SKIP ${hash} (exists)`);
    }
    mapping[t] = `${hash}.mp3`;
  }
  
  fs.writeFileSync(path.join(outDir, 'mapping.json'), JSON.stringify(mapping, null, 2));
  console.log(`\nDone. ${Object.keys(mapping).length} files.`);
  console.log(`mapping.json written to ${path.join(outDir, 'mapping.json')}`);
})().catch(console.error);
