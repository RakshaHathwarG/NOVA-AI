import { memo } from 'react'
import InteractiveAvatarSkin from './skins/InteractiveAvatarSkin'
import CorporateAvatarSkin from './skins/CorporateAvatarSkin'
import PhotoAvatarSkin from './skins/PhotoAvatarSkin'

/**
 * AvatarRenderer — the single integration point between the Avatar Engine
 * (state machine + speech) and whatever visual skin actually draws the avatar.
 *
 * Primary skin:
 *   InteractiveAvatarSkin — crisp 4K vector interactive skin supporting full face
 *   blinking, eye gaze, eyebrow emotions (happy, sad, angry, thinking), lip sync visemes,
 *   head nod/tilt, waving/pointing/open-hand gestures, and body physics.
 */
function AvatarRenderer({ persona, state, eyesClosed }) {
  return <InteractiveAvatarSkin persona={persona} state={state} eyesClosed={eyesClosed} />
}

export default memo(AvatarRenderer)
