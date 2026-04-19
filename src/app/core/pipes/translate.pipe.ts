import { Pipe, PipeTransform } from '@angular/core';
import { t, Lang } from '../i18n/translations';

@Pipe({ name: 't', standalone: true, pure: true })
export class TranslatePipe implements PipeTransform {
  transform(key: string, lang: Lang): string {
    return t(key, lang);
  }
}
