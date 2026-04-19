export type AppTheme = 'light' | 'dark' | 'felt-green';
export type AppLanguage = 'es' | 'en';

export interface ColorMapping {
  readonly type: string;
  readonly color: string;
}

export interface AppSettings {
  readonly theme: AppTheme;
  readonly language: AppLanguage;
  readonly colorMappings: ColorMapping[];
  readonly seatCount: number;
}
