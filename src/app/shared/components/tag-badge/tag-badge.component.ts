import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-tag-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white truncate max-w-24"
      [style.background-color]="color()"
    >
      {{ name() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagBadgeComponent {
  readonly name = input.required<string>();
  readonly color = input.required<string>();
}
