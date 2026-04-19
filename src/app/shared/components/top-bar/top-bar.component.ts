import { Component, ChangeDetectionStrategy, output, inject, computed } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { SettingsService } from '../../../features/settings/services/settings.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <header
      class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-md z-40"
    >
      <div class="flex items-center gap-2">
        <span class="text-xl">🃏</span>
        <h1 class="text-lg font-bold tracking-tight cursor-pointer" (click)="navigateHome.emit()">
          PokerNotes
        </h1>
      </div>

      <nav class="flex items-center gap-1">
        <button
          class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          [title]="'nav.players' | t: lang()"
          (click)="navigatePlayers.emit()"
        >
          👥
        </button>
        <button
          class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          [title]="'nav.settings' | t: lang()"
          (click)="navigateSettings.emit()"
        >
          ⚙️
        </button>
      </nav>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private readonly settingsService = inject(SettingsService);
  protected readonly lang = computed(() => this.settingsService.settings().language);

  readonly navigateHome = output<void>();
  readonly navigatePlayers = output<void>();
  readonly navigateSettings = output<void>();
}
