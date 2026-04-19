import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        (click)="onCancel()"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-md shadow-xl p-4 mx-4 max-w-sm w-full"
          (click)="$event.stopPropagation()"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ title() }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ message() }}
          </p>
          <div class="flex justify-end gap-2">
            <button
              class="px-3 py-1.5 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              (click)="onCancel()"
            >
              Cancelar
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly open = input.required<boolean>();
  readonly title = input('¿Estás seguro?');
  readonly message = input('Esta acción no se puede deshacer.');
  readonly confirmLabel = input('Eliminar');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
