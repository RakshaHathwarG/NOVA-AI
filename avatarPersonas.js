/**
 * Avatar persona configuration for the Avatar Engine.
 *
 * This is intentionally separate from `utils/constants.js` (ROLES), which
 * powers the Dashboard and Role Selection cards and must stay untouched.
 * These personas are consumed only by the assistant chat experience
 * (ChatWindow / AvatarEngine) so the two naming systems can evolve
 * independently without breaking pages outside the chat.
 */

export const AVATAR_PERSONAS = {
  aria: {
    id: 'aria',
    name: 'Aria',
    role: 'Senior HR Virtual Assistant',
    accent: 'indigo',
    // Appearance descriptors — consumed by the current PortraitSkin and,
    // later, by a photorealistic 3D/video skin without changing callers.
    appearance: {
      outfit: 'Navy blazer over a white shirt',
      hair: 'Shoulder-length dark hair, professional style',
      lighting: 'Elegant office lighting',
      environment: 'Professional office environment',
      palette: {
        outfitPrimary: '#1A2A5C',
        outfitShadow: '#0F1A3E',
        outfitHighlight: '#2E3E7A',
        outfitSecondary: '#FFFFFF',
        hair: '#181411',
        hairHighlight: '#2F2620',
        skin: '#E8C4A8',
        skinShadow: '#CDA784',
        lips: '#C53A24',
        brow: '#221A14',
        eyeliner: '#1A1210',
        iris: '#523A2E',
        earring: '#D8B25C',
      },
    },
    personality: ['Professional', 'Confident', 'Patient', 'Calm', 'Respectful'],
    greeting:
      "Hello. Welcome to NOVA AI. I'm Aria, your Senior HR Virtual Assistant. How may I assist you today?",
    goodbye: 'Thank you for the conversation. Have a wonderful day.',
    defaultVoiceLang: 'en-US',
  },
  snow: {
    id: 'snow',
    name: 'Snow',
    role: 'Customer Support Virtual Assistant',
    accent: 'cyan',
    appearance: {
      outfit: 'Soft blue modern support attire',
      hair: 'Side-swept auburn hair, distinct from Aria',
      lighting: 'Warm, welcoming lighting',
      environment: 'Modern customer support environment',
      palette: {
        outfitPrimary: '#3FA0DC',
        outfitShadow: '#2A79B3',
        outfitHighlight: '#6CC0EE',
        outfitSecondary: '#FBFEFF',
        hair: '#5B3A28',
        hairHighlight: '#7C5238',
        skin: '#EAC5A2',
        skinShadow: '#D2A17C',
        lips: '#C63A2E',
        brow: '#4A2E1E',
        eyeliner: '#33221A',
        iris: '#5C3D28',
        earring: '#D8B25C',
      },
    },
    personality: ['Helpful', 'Friendly', 'Energetic', 'Patient', 'Cheerful'],
    greeting:
      "Hello. Welcome to NOVA AI. I'm Snow, your Customer Support Virtual Assistant. How may I help you today?",
    goodbye: "It was great helping you today. Take care!",
    defaultVoiceLang: 'en-US',
  },
}

// Maps the LanguageSelector's display labels to BCP-47 codes used by the
// Web Speech API and to voice-matching logic in useSpeechSynthesis.
export const VOICE_LANGUAGE_CODES = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Spanish: 'es-ES',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
}

export const BOOT_SEQUENCE_STEPS = [
  'Initializing Avatar…',
  'Loading Personality…',
  'Loading Voice Engine…',
  'Loading Facial Expressions…',
  'Synchronizing AI Brain…',
]
