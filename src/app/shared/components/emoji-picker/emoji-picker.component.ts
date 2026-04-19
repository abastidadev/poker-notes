import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AVATAR_EMOJIS } from '../../../core/constants/default-colors.const';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        (click)="close.emit()"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-md shadow-xl p-3 mx-4 w-72"
          (click)="$event.stopPropagation()"
        >
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Elegir avatar</h3>
          <div class="grid grid-cols-10 gap-0.5">
            @for (emoji of emojis; track emoji) {
              <button
                class="w-full aspect-square flex items-center justify-center text-lg rounded transition-colors"
                [class]="
                  emoji === selected()
                    ? 'bg-blue-500 ring-2 ring-blue-400 ring-offset-1 dark:ring-offset-gray-800'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                "
                (click)="emojiSelected.emit(emoji)"
              >
                {{ emoji }}
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiPickerComponent {
  readonly open = input.required<boolean>();
  readonly selected = input('');
  readonly emojiSelected = output<string>();
  readonly close = output<void>();

  protected readonly emojis = AVATAR_EMOJIS;
}
