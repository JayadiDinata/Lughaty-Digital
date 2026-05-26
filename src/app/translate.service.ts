import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private async request(url: string, timeout = 7000): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = timeout;
      xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
        else reject(new Error('HTTP ' + xhr.status));
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Timeout'));
      xhr.send();
    });
  }

  async translate(text: string, source: string, target: string): Promise<string> {
    const src = source === 'detect' ? 'auto' : source;

    // MyMemory tidak support auto-detect, skip langsung ke Google
    if (src !== 'auto') {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${target}`;
        const raw = await this.request(url);
        const data = JSON.parse(raw);
        const t = data?.responseData?.translatedText;
        if (t && data.responseStatus === 200) return t;
      } catch { /* fallthrough */ }
    }

    // Google Translate — support auto-detect
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
      const raw = await this.request(url);
      const data = JSON.parse(raw);
      const translated = data?.[0]?.map((s: any) => s?.[0]).filter(Boolean).join('');
      if (translated) return translated;
    } catch { /* fallthrough */ }

    throw new Error('Server penerjemah tidak tersedia.');
  }
}