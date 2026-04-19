import { Injectable, inject, signal, effect } from '@angular/core';
import { AppSettings, AppLanguage, ColorMapping } from '../../../core/models/settings.model';
import { DEFAULT_COLOR_MAPPINGS } from '../../../core/constants/default-colors.const';
import { StorageService } from '../../../core/services/storage.service';
import { ThemeService } from '../../../core/services/theme.service';

function createDefaultSettings(): AppSettings {
  return {
    theme: 'dark',
    language: 'es',
    colorMappings: [...DEFAULT_COLOR_MAPPINGS],
  };
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(StorageService);
  private readonly themeService = inject(ThemeService);

  readonly settings = signal<AppSettings>(this.loadSettings());

  constructor() {
    this.themeService.setTheme(this.settings().theme);

    effect(() => {
      const s = this.settings();
      this.storage.set('settings', s);
      this.themeService.setTheme(s.theme);
    });
  }

  setLanguage(language: AppLanguage): void {
    this.settings.update((s) => ({ ...s, language }));
  }

  setTheme(theme: AppSettings['theme']): void {
    this.settings.update((s) => ({ ...s, theme }));
  }

  updateColorMapping(type: string, color: string): void {
    this.settings.update((s) => ({
      ...s,
      colorMappings: s.colorMappings.map((m) => (m.type === type ? { ...m, color } : m)),
    }));
  }

  resetColorMappings(): void {
    this.settings.update((s) => ({ ...s, colorMappings: [...DEFAULT_COLOR_MAPPINGS] }));
  }

  getColorForType(type: string): string {
    return this.settings().colorMappings.find((m) => m.type === type)?.color ?? '#6B7280';
  }

  private loadSettings(): AppSettings {
    return this.storage.get<AppSettings>('settings') ?? createDefaultSettings();
  }
}
