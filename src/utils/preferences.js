const STORAGE_KEY = 'nova_preferences'

export const DEFAULT_PREFERENCES = {
  language: 'English',
  voiceEnabled: true,
  speechRate: 1,
  notificationsEnabled: false,
}

export function getPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const speechRate = Number(saved.speechRate)
    return {
      ...DEFAULT_PREFERENCES,
      ...saved,
      speechRate: Number.isFinite(speechRate) ? Math.min(1.2, Math.max(0.8, speechRate)) : 1,
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function savePreferences(updates) {
  const next = { ...getPreferences(), ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}
