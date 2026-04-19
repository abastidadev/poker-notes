import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="color"
        [ngModel]="value()"
        (ngModelChange)="onColorChange($event)"
        class="w-8 h-8 rounded-md border-0 cursor-pointer bg-transparent p-0"
      />
      @if (showLabel()) {
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ value() }}</span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent {
  readonly value = input.required<string>();
  readonly showLabel = input(false);
  readonly colorChange = output<string>();

  onColorChange(color: string): void {
    this.colorChange.emit(color);
  }
}
