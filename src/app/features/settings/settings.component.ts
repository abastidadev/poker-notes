import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  output,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from './services/settings.service';
import { TagService } from '../tags/services/tag.service';
import { StorageService } from '../../core/services/storage.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker.component';
import { DEFAULT_COLOR_MAPPINGS } from '../../core/constants/default-colors.const';
import { COLOR_TYPE_LABELS } from '../../core/constants/default-colors.const';
import { AppTheme, AppLanguage } from '../../core/models/settings.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, ConfirmDialogComponent, ColorPickerComponent, TranslatePipe],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly settingsService = inject(SettingsService);
  private readonly tagService = inject(TagService);
  private readonly storageService = inject(StorageService);

  readonly goBack = output<void>();

  protected readonly settings = this.settingsService.settings;
  protected readonly lang = computed(() => this.settings().language);
  protected readonly customTags = () => this.tagService.allTags().filter((t) => t.isCustom);
  protected readonly defaultColorMappings = DEFAULT_COLOR_MAPPINGS;
  protected readonly colorTypeLabels = COLOR_TYPE_LABELS;

  protected readonly showClearConfirm = signal(false);
  protected readonly showClearDoubleConfirm = signal(false);
  protected readonly showImportConfirm = signal(false);
  protected readonly pendingImportData = signal('');
  protected readonly editingTagId = signal<string | null>(null);
  protected readonly editTagName = signal('');
  protected readonly editTagColor = signal('');
  protected readonly newTagName = signal('');
  protected readonly newTagColor = signal('#6B7280');

  onThemeChange(theme: string): void {
    this.settingsService.setTheme(theme as AppTheme);
  }

  onLanguageChange(language: string): void {
    this.settingsService.setLanguage(language as AppLanguage);
  }

  onColorMappingChange(type: string, color: string): void {
    this.settingsService.updateColorMapping(type, color);
  }

  onResetColorMapping(type: string): void {
    const defaultColor = DEFAULT_COLOR_MAPPINGS.find((m) => m.type === type)?.color;
    if (defaultColor) {
      this.settingsService.updateColorMapping(type, defaultColor);
    }
  }

  getTypeLabel(type: string): string {
    const lang = this.settings().language;
    return this.colorTypeLabels[type]?.[lang] ?? type;
  }

  // Tag management
  onEditTag(tag: { id: string; name: string; color: string }): void {
    this.editingTagId.set(tag.id);
    this.editTagName.set(tag.name);
    this.editTagColor.set(tag.color);
  }

  onSaveTag(): void {
    const id = this.editingTagId();
    if (!id) return;
    this.tagService.updateTag(id, { name: this.editTagName(), color: this.editTagColor() });
    this.editingTagId.set(null);
  }

  onDeleteTag(id: string): void {
    this.tagService.deleteCustomTag(id);
  }

  onCreateTag(): void {
    const name = this.newTagName().trim();
    if (!name) return;
    this.tagService.addCustomTag(name, this.newTagColor());
    this.newTagName.set('');
    this.newTagColor.set('#6B7280');
  }

  // Data management
  onExport(): void {
    const json = this.storageService.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poker-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.pendingImportData.set(reader.result as string);
      this.showImportConfirm.set(true);
    };
    reader.readAsText(file);
    input.value = '';
  }

  onConfirmImport(): void {
    const success = this.storageService.importAll(this.pendingImportData());
    if (success) {
      window.location.reload();
    }
    this.showImportConfirm.set(false);
  }

  onClearData(): void {
    this.showClearConfirm.set(true);
  }

  onFirstConfirm(): void {
    this.showClearConfirm.set(false);
    this.showClearDoubleConfirm.set(true);
  }

  onFinalClear(): void {
    this.storageService.clear();
    this.showClearDoubleConfirm.set(false);
    window.location.reload();
  }
}
