import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';
import { TableComponent } from './features/table/table.component';
import { PlayerProfileComponent } from './features/player-profile/player-profile.component';
import { PlayerListComponent } from './features/player-list/player-list.component';
import { SettingsComponent } from './features/settings/settings.component';
import { SettingsService } from './features/settings/services/settings.service';

type AppView = 'table' | 'players' | 'settings';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TopBarComponent,
    TableComponent,
    PlayerProfileComponent,
    PlayerListComponent,
    SettingsComponent,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Force SettingsService to initialize at startup so the saved theme is applied immediately
  private readonly _settings = inject(SettingsService);

  protected readonly currentView = signal<AppView>('table');
  protected readonly selectedPlayerId = signal<string | null>(null);
  protected readonly showPlayerProfile = signal(false);

  onSeatClicked(event: { seatNumber: number; playerId: string | null }): void {
    if (event.playerId) {
      this.selectedPlayerId.set(event.playerId);
      this.showPlayerProfile.set(true);
    }
  }

  onPlayerSelected(playerId: string): void {
    this.selectedPlayerId.set(playerId);
    this.showPlayerProfile.set(true);
  }

  onCloseProfile(): void {
    this.showPlayerProfile.set(false);
    this.selectedPlayerId.set(null);
  }

  navigateTo(view: AppView): void {
    this.currentView.set(view);
    this.showPlayerProfile.set(false);
  }
}
