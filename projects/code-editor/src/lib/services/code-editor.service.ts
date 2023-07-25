import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { CodeEditorSettings } from '../editor-settings';

declare const monaco: any;

export const EDITOR_SETTINGS = new InjectionToken<CodeEditorSettings>(
  'EDITOR_SETTINGS'
);

export interface TypingsInfo {
  entryPoints: { [key: string]: string };
  files: Array<{
    content: string;
    name: string;
    url: string;
    path: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class CodeEditorService {
  // baseUrl = 'assets/monaco';
  baseUrl = 'https://unpkg.com/monaco-editor/min';

  // typingsWorkerUrl = 'assets/workers/typings-worker.js';
  typingsWorkerUrl =
    'https://unpkg.com/@ngstack/code-editor/workers/typings-worker.js';

  typingsLoaded = new Subject<TypingsInfo>();
  loaded = new BehaviorSubject<{ monaco: any } | null>(null);

  loadingTypings = new BehaviorSubject<boolean>(false);

  private typingsWorker: Worker;

  constructor(
    @Optional()
    @Inject(EDITOR_SETTINGS)
    settings: CodeEditorSettings
  ) {
    const defaults = {
      baseUrl: this.baseUrl,
      typingsWorkerUrl: this.typingsWorkerUrl,
      ...settings,
    };

    this.baseUrl = defaults.baseUrl;
    this.typingsWorkerUrl = defaults.typingsWorkerUrl;
  }

  private loadTypingsWorker(): Worker {
    if (!this.typingsWorker && (<any>window).Worker) {
      if (this.typingsWorkerUrl.startsWith('http')) {
        const proxyScript = `importScripts('${this.typingsWorkerUrl}');`;
        const proxy = URL.createObjectURL(
          new Blob([proxyScript], { type: 'text/javascript' })
        );
        this.typingsWorker = new Worker(proxy);
      } else {
        this.typingsWorker = new Worker(this.typingsWorkerUrl);
      }
      this.typingsWorker.addEventListener('message', (e) => {
        this.loadingTypings.next(false);
        this.typingsLoaded.next(e.data);
      });
    }
    return this.typingsWorker;
  }

  loadTypings(dependencies: string[]) {
    if (dependencies && dependencies.length > 0) {
      const worker = this.loadTypingsWorker();
      if (worker) {
        this.loadingTypings.next(true);
        worker.postMessage({
          dependencies,
        });
      }
    }
  }

  loadEditor(): Promise<void> {
    return new Promise((resolve) => {
      const onGotAmdLoader = () => {
        (<any>window).require.config({
          paths: { vs: `${this.baseUrl}/vs` },
        });

        if (this.baseUrl.startsWith('http')) {
          const proxyScript = `
            self.MonacoEnvironment = {
              baseUrl: "${this.baseUrl}"
            };
            importScripts('${this.baseUrl}/vs/base/worker/workerMain.js');
          `;
          const proxy = URL.createObjectURL(
            new Blob([proxyScript], { type: 'text/javascript' })
          );
          window['MonacoEnvironment'] = {
            getWorkerUrl: function () {
              return proxy;
            },
          };
        }

        (<any>window).require(['vs/editor/editor.main'], () => {
          this.loaded.next({ monaco });
          resolve();
        });
      };

      if (!(<any>window).require) {
        const loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = `${this.baseUrl}/vs/loader.js`;
        loaderScript.addEventListener('load', onGotAmdLoader);
        document.body.appendChild(loaderScript);
      } else {
        onGotAmdLoader();
      }
    });
  }
}
