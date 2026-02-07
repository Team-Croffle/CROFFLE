import { net } from 'electron';
import { HttpResponse } from '@croffledev/croffle-common';

class HttpService {
  private readonly TIMEOUT = 10000;

  public async get(
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ): Promise<HttpResponse> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request('GET', `${url}${queryString}`, undefined, headers);
  }

  public async post(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<HttpResponse> {
    return this.request('POST', url, body, headers);
  }

  private async request(
    method: 'GET' | 'POST',
    url: string,
    body?: unknown,
    customHeaders?: Record<string, string>
  ): Promise<HttpResponse> {
    return new Promise((resolve) => {
      console.info(`[Http] ${method} ${url}`);

      const request = net.request({ method, url });

      // Header
      request.setHeader('Content-Type', 'application/json');

      if (customHeaders) {
        Object.entries(customHeaders).forEach(([k, v]) => request.setHeader(k, v));
      }

      // Timer
      const timer = setTimeout(() => {
        request.abort();
        resolve({ ok: false, status: 408, data: null });
      }, this.TIMEOUT);

      request.on('response', (response) => {
        clearTimeout(timer);
        const chunks: Buffer[] = [];

        response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        response.on('end', () => {
          const status = response.statusCode ?? 0;
          const raw = Buffer.concat(chunks).toString('utf-8');

          let data: unknown = null;
          try {
            data = raw ? JSON.parse(raw) : null;
          } catch {
            data = null;
          }

          resolve({
            ok: status >= 200 && status < 300,
            status,
            data,
          });
        });
      });

      request.on('error', () => {
        clearTimeout(timer);
        resolve({ ok: false, status: 0, data: null });
      });

      if (body !== undefined) {
        request.write(JSON.stringify(body));
      }
      request.end();
    });
  }
}

export const httpService = new HttpService();
