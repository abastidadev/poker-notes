import { Injectable } from '@angular/core';

const STORAGE_PREFIX = 'poker-notes-';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  exportAll(): string {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const shortKey = key.replace(STORAGE_PREFIX, '');
        try {
          data[shortKey] = JSON.parse(localStorage.getItem(key)!);
        } catch {
          data[shortKey] = localStorage.getItem(key);
        }
      }
    }
    return JSON.stringify(data, null, 2);
  }

  importAll(json: string): boolean {
    try {
      const data = JSON.parse(json) as Record<string, unknown>;
      if (typeof data !== 'object' || data === null) return false;
      this.clear();
      for (const [key, value] of Object.entries(data)) {
        this.set(key, value);
      }
      return true;
    } catch {
      return false;
    }
  }
}
