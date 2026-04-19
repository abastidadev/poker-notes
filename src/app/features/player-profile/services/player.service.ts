import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Player } from '../../../core/models/player.model';
import { SessionEntry } from '../../../core/models/session.model';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly storage = inject(StorageService);

  readonly players = signal<Player[]>(this.loadPlayers());
  readonly playerCount = computed(() => this.players().length);

  constructor() {
    effect(() => this.storage.set('players', this.players()));
  }

  getById(id: string): Player | undefined {
    return this.players().find((p) => p.id === id);
  }

  create(data: Pick<Player, 'alias' | 'color' | 'avatar'>): Player {
    const now = new Date().toISOString();
    const player: Player = {
      id: crypto.randomUUID(),
      alias: data.alias,
      color: data.color,
      avatar: data.avatar,
      notes: '',
      tagIds: [],
      sessionHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    this.players.update((ps) => [...ps, player]);
    return player;
  }

  update(id: string, updates: Partial<Omit<Player, 'id' | 'createdAt'>>): void {
    this.players.update((ps) =>
      ps.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
    );
  }

  delete(id: string): void {
    this.players.update((ps) => ps.filter((p) => p.id !== id));
  }

  addTag(playerId: string, tagId: string): void {
    this.players.update((ps) =>
      ps.map((p) =>
        p.id === playerId && !p.tagIds.includes(tagId)
          ? { ...p, tagIds: [...p.tagIds, tagId], updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  }

  removeTag(playerId: string, tagId: string): void {
    this.players.update((ps) =>
      ps.map((p) =>
        p.id === playerId
          ? {
              ...p,
              tagIds: p.tagIds.filter((t) => t !== tagId),
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
  }

  addSession(playerId: string, session: Omit<SessionEntry, 'id'>): void {
    const entry: SessionEntry = { ...session, id: crypto.randomUUID() };
    this.players.update((ps) =>
      ps.map((p) =>
        p.id === playerId
          ? {
              ...p,
              sessionHistory: [entry, ...p.sessionHistory],
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
  }

  removeSession(playerId: string, sessionId: string): void {
    this.players.update((ps) =>
      ps.map((p) =>
        p.id === playerId
          ? {
              ...p,
              sessionHistory: p.sessionHistory.filter((s) => s.id !== sessionId),
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
  }

  private loadPlayers(): Player[] {
    return this.storage.get<Player[]>('players') ?? [];
  }
}
