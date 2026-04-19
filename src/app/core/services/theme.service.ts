import { Injectable, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppTheme } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<AppTheme>('dark');

  constructor() {
    effect(() => this.applyTheme(this.theme()));
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);
  }

  private applyTheme(theme: AppTheme): void {
    const html = this.document.documentElement;
    const body = this.document.body;
    html.classList.remove('dark', 'theme-felt-green');
    body.classList.remove('bg-gray-950', 'text-white', 'bg-gray-50', 'text-gray-900');

    if (theme === 'light') {
      body.classList.add('bg-gray-50', 'text-gray-900');
    } else if (theme === 'dark') {
      html.classList.add('dark');
      body.classList.add('bg-gray-950', 'text-white');
    } else if (theme === 'felt-green') {
      html.classList.add('dark', 'theme-felt-green');
      body.classList.add('bg-gray-950', 'text-white');
    }
  }
}
