export type Lang = 'es' | 'en';

export const T: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.players': { es: 'Jugadores', en: 'Players' },
  'nav.settings': { es: 'Ajustes', en: 'Settings' },

  // Table
  'table.hint': { es: 'Pulsa un asiento para empezar 👆', en: 'Tap a seat to get started 👆' },
  'table.ctxRemove': { es: '🗑 Eliminar hueco', en: '🗑 Remove slot' },
  'table.ctxRemoveEmpty': { es: '🗑 Eliminar hueco', en: '🗑 Remove slot' },
  'table.ctxAdd': { es: '➕ Añadir jugador', en: '➕ Add player' },
  'table.ctxAddSeat': { es: '➕ Añadir hueco de jugador', en: '➕ Add player seat' },

  // Assign dialog
  'assign.seat': { es: 'Asiento', en: 'Seat' },
  'assign.search': { es: 'Buscar jugador...', en: 'Search player...' },
  'assign.noPlayers': { es: 'No hay jugadores disponibles', en: 'No players available' },
  'assign.createNew': { es: '+ Crear nuevo jugador', en: '+ Create new player' },
  'assign.alias': { es: 'Alias', en: 'Alias' },
  'assign.playerName': { es: 'Nombre del jugador', en: 'Player name' },
  'assign.color': { es: 'Color', en: 'Color' },
  'assign.avatar': { es: 'Avatar', en: 'Avatar' },
  'assign.back': { es: 'Volver', en: 'Back' },
  'assign.createAssign': { es: 'Crear y asignar', en: 'Create & assign' },

  // Player list
  'players.title': { es: 'Jugadores', en: 'Players' },
  'players.searchPlaceholder': { es: 'Buscar por alias...', en: 'Search by alias...' },
  'players.allTags': { es: 'Todas las etiquetas', en: 'All tags' },
  'players.sessions': { es: 'sesiones', en: 'sessions' },
  'players.empty': { es: 'No hay jugadores guardados', en: 'No players saved' },
  'players.emptyHint': {
    es: 'Pulsa un asiento en la mesa para crear uno',
    en: 'Tap a seat at the table to create one',
  },
  'players.deleteConfirmTitle': { es: 'Eliminar jugador', en: 'Delete player' },
  'players.deleteConfirmMsg': {
    es: '¿Seguro que quieres eliminar a este jugador?',
    en: 'Are you sure you want to delete this player?',
  },
  'players.deleteConfirmBtn': { es: 'Eliminar', en: 'Delete' },

  // Player profile
  'profile.tags': { es: 'Etiquetas', en: 'Tags' },
  'profile.addTag': { es: '+ Añadir etiqueta', en: '+ Add tag' },
  'profile.predefined': { es: 'Predefinidas', en: 'Predefined' },
  'profile.custom': { es: 'Personalizadas', en: 'Custom' },
  'profile.createTag': { es: '+ Crear nueva etiqueta', en: '+ Create new tag' },
  'profile.tagName': { es: 'Nombre', en: 'Name' },
  'profile.notes': { es: 'Notas', en: 'Notes' },
  'profile.notesPlaceholder': {
    es: 'Ej: dobla siempre con AA, minisube = farol',
    en: 'E.g.: always 3-bets AA, min-raise = bluff',
  },
  'profile.history': { es: 'Historial', en: 'History' },
  'profile.addSession': { es: '+ Añadir sesión', en: '+ Add session' },
  'profile.sessionLocation': { es: 'Casino / Sala online', en: 'Casino / Online room' },
  'profile.sessionNotes': { es: 'Notas de la sesión', en: 'Session notes' },
  'profile.saveSession': { es: 'Guardar sesión', en: 'Save session' },
  'profile.noSessions': { es: 'Sin sesiones registradas', en: 'No sessions recorded' },
  'profile.removeFromTable': { es: 'Quitar de la mesa', en: 'Remove from table' },
  'profile.deletePlayer': { es: 'Eliminar jugador', en: 'Delete player' },
  'profile.deleteTitle': { es: 'Eliminar jugador', en: 'Delete player' },
  'profile.deleteMsg': {
    es: '¿Seguro que quieres eliminar a',
    en: 'Are you sure you want to delete',
  },
  'profile.deleteMsg2': {
    es: '? Esta acción no se puede deshacer.',
    en: '? This action cannot be undone.',
  },
  'profile.changeAvatar': { es: 'Cambiar avatar', en: 'Change avatar' },

  // Settings
  'settings.title': { es: 'Ajustes', en: 'Settings' },
  'settings.appearance': { es: 'Apariencia', en: 'Appearance' },
  'settings.light': { es: '☀️ Claro', en: '☀️ Light' },
  'settings.dark': { es: '🌙 Oscuro', en: '🌙 Dark' },
  'settings.felt': { es: '🃏 Tapete', en: '🃏 Felt' },
  'settings.language': { es: 'Idioma', en: 'Language' },
  'settings.colorsTitle': { es: 'Colores por tipo', en: 'Colors by type' },
  'settings.resetColor': { es: 'Restaurar', en: 'Reset' },
  'settings.seatCount': { es: 'Número de jugadores', en: 'Number of players' },
  'settings.tags': { es: 'Etiquetas', en: 'Tags' },
  'settings.noTags': { es: 'No hay etiquetas', en: 'No tags' },
  'settings.customTags': { es: 'Etiquetas personalizadas', en: 'Custom tags' },
  'settings.noCustomTags': { es: 'No hay etiquetas personalizadas', en: 'No custom tags' },
  'settings.newTagPlaceholder': { es: 'Nueva etiqueta', en: 'New tag' },
  'settings.createTag': { es: '+ Crear', en: '+ Create' },
  'settings.data': { es: 'Datos', en: 'Data' },
  'settings.export': { es: '📥 Exportar datos', en: '📥 Export data' },
  'settings.import': { es: '📤 Importar datos', en: '📤 Import data' },
  'settings.clear': { es: '🗑 Borrar todos los datos', en: '🗑 Clear all data' },
  'settings.importConfirmTitle': { es: 'Importar datos', en: 'Import data' },
  'settings.importConfirmMsg': {
    es: 'Esto sobrescribirá todos los datos actuales. ¿Continuar?',
    en: 'This will overwrite all current data. Continue?',
  },
  'settings.importConfirmBtn': { es: 'Importar', en: 'Import' },
  'settings.clearConfirmTitle': { es: 'Borrar todos los datos', en: 'Clear all data' },
  'settings.clearConfirmMsg': {
    es: 'Se eliminarán todos los jugadores, etiquetas y configuraciones. ¿Continuar?',
    en: 'All players, tags and settings will be deleted. Continue?',
  },
  'settings.clearConfirmBtn': { es: 'Sí, continuar', en: 'Yes, continue' },
  'settings.clearFinalTitle': { es: '⚠️ Última confirmación', en: '⚠️ Final confirmation' },
  'settings.clearFinalMsg': {
    es: 'Esta acción es IRREVERSIBLE. ¿Estás absolutamente seguro?',
    en: 'This action is IRREVERSIBLE. Are you absolutely sure?',
  },
  'settings.clearFinalBtn': { es: 'Borrar todo', en: 'Delete all' },
};

export function t(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.['es'] ?? key;
}
