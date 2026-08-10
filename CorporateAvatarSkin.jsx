import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function CorporateAvatarSkin({ persona, state = 'idle', eyesClosed = false }) {
  const isAria = persona.id === 'aria';
  const palette = persona.appearance.palette;

  // Blinking state
  const [isBlinking, setIsBlinking] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  // Blink every 3-5 seconds
  useEffect(() => {
    let timeout;
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      timeout = setTimeout(() => {
        if (!eyesClosed) {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 150);
        }
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => clearTimeout(timeout);
  }, [eyesClosed]);

  // Idle eye movement
  useEffect(() => {
    if (state !== 'idle' && state !== 'listening') {
      setGaze({ x: 0, y: 0 });
      return;
    }
    let timeout;
    const scheduleShift = () => {
      const delay = 2000 + Math.random() * 2000;
      timeout = setTimeout(() => {
        setGaze({
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 2,
        });
        scheduleShift();
      }, delay);
    };
    scheduleShift();
    return () => clearTimeout(timeout);
  }, [state]);

  // Animation values based on state
  const headTilt = state === 'listening' ? 6 : state === 'thinking' ? -5 : 0;
  const eyesYOffset = state === 'thinking' ? -3 : 0;
  const showWave = state === 'greeting' || state === 'goodbye';
  const breathing = state === 'idle' || state === 'listening' || state === 'thinking';
  const eyeScaleY = eyesClosed || isBlinking ? 0.08 : 1;

  // Get mouth path based on state
  const getMouthPath = () => {
    if (state === 'greeting' || state === 'goodbye' || state === 'smiling') {
      return 'M108,160 Q130,172 152,160 Q130,164 108,160 Z';
    } else if (state === 'thinking') {
      return 'M116,162 Q130,158 144,162 Q130,168 116,162 Z';
    } else if (state === 'speaking') {
      return 'M110,162 Q130,176 150,162 Q130,180 110,162 Z';
    } else {
      return 'M112,162 Q130,168 148,162 Q130,170 112,162 Z';
    }
  };

  const getEyebrowRotation = () => {
    if (state === 'thinking') return -3;
    return 0;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      <svg viewBox="0 0 280 480" className="w-full h-full max-w-[300px]" aria-hidden="true">
        {/* Main Avatar Group */}
        <motion.g
          animate={{
            rotate: [headTilt - 0.4, headTilt + 0.4, headTilt - 0.4],
            y: breathing ? [0, -2.5, 0] : 0,
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 4.5, repeat: breathing ? Infinity : 0, ease: 'easeInOut' },
          }}
          style={{ transformOrigin: '140px 320px' }}
        >
          {/* Torso (Blazer) */}
          <motion.g
            animate={{ scaleY: [1, 1.012, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '140px 480px' }}
          >
            {/* Blazer Body */}
            <path
              d={isAria 
                ? 'M60,320 C64,260 88,240 140,234 C192,240 216,260 220,320 L220,400 L60,400 Z'
                : 'M62,320 C66,258 90,238 140,232 C190,238 214,258 218,320 L218,400 L62,400 Z'}
              fill={palette.outfitPrimary}
            />

            {/* Blazer Collar */}
            <path
              d={isAria
                ? 'M104,238 L140,260 L176,238 L176,248 L140,274 L104,248 Z'
                : 'M106,236 L140,256 L174,236 L174,246 L140,270 L106,246 Z'}
              fill={palette.outfitSecondary}
            />

            {/* Blazer Lapels */}
            <path
              d={isAria
                ? 'M80,320 L120,240 L140,252 L100,332 Z'
                : 'M82,320 L122,238 L140,248 L102,332 Z'}
              fill={palette.outfitHighlight}
              opacity={0.8}
            />
            <path
              d={isAria
                ? 'M200,320 L160,240 L140,252 L180,332 Z'
                : 'M198,320 L158,238 L140,248 L178,332 Z'}
              fill={palette.outfitShadow}
              opacity={0.3}
            />

            {/* Shirt Placket (Aria only) */}
            {isAria && (
              <path
                d="M140,260 L140,340"
                stroke="#e5e5e5"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Pants */}
            <path
              d={isAria
                ? 'M80,400 L95,480 L140,480 L140,400 L140,480 L185,480 L200,400 Z'
                : 'M82,400 L97,480 L140,480 L140,400 L140,480 L183,480 L198,400 Z'}
              fill={isAria ? palette.outfitPrimary : '#f0f0f0'}
            />

            {/* Shoes */}
            {/* Left Shoe */}
            <ellipse cx="110" cy="476" rx="16" ry="6" fill={isAria ? '#1a1a1a' : palette.outfitPrimary} />
            <rect x="96" y="464" width="28" height="14" rx="3" fill={isAria ? '#1a1a1a' : palette.outfitPrimary} />
            {/* Right Shoe */}
            <ellipse cx="170" cy="476" rx="16" ry="6" fill={isAria ? '#1a1a1a' : palette.outfitPrimary} />
            <rect x="156" y="464" width="28" height="14" rx="3" fill={isAria ? '#1a1a1a' : palette.outfitPrimary} />
          </motion.g>

          {/* Left Arm (behind body) */}
          <g>
            <path
              d={isAria
                ? 'M62,325 C50,360 55,410 70,430'
                : 'M64,323 C52,358 57,408 72,428'}
              stroke={palette.outfitPrimary}
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Hand */}
            <ellipse cx="70" cy="430" rx="10" ry="14" fill={palette.skin} />
          </g>

          {/* Right Arm (in front for waving) */}
          <motion.g
            initial={{ rotate: -10, opacity: 0, y: 0 }}
            animate={{
              rotate: showWave ? (state === 'goodbye' ? [-10, 25, -10] : [-10, 30, -10, 30, -10]) : -10,
              opacity: 1,
              y: showWave ? (state === 'goodbye' ? [0, -12, 0] : [0, -15, 0, -15, 0]) : 0,
            }}
            transition={{
              rotate: {
                duration: state === 'goodbye' ? 1.2 : 1.6,
                repeat: state === 'goodbye' ? 0 : 0,
                ease: 'easeInOut',
              },
              y: {
                duration: state === 'goodbye' ? 1.2 : 1.6,
                repeat: state === 'goodbye' ? 0 : 0,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.25 },
            }}
            style={{ transformOrigin: '210px 320px' }}
          >
            <path
              d={isAria
                ? 'M218,325 C230,360 225,410 210,430'
                : 'M216,323 C228,358 223,408 208,428'}
              stroke={palette.outfitPrimary}
              strokeWidth="28"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Hand */}
            <ellipse cx="210" cy="430" rx="10" ry="14" fill={palette.skin} />
            {/* Fingers for waving */}
            {showWave && (
              <g>
                <line x1="202" y1="420" x2="198" y2="405" stroke={palette.skin} strokeWidth="6" strokeLinecap="round" />
                <line x1="208" y1="418" x2="206" y2="402" stroke={palette.skin} strokeWidth="6" strokeLinecap="round" />
                <line x1="214" y1="418" x2="216" y2="402" stroke={palette.skin} strokeWidth="6" strokeLinecap="round" />
                <line x1="220" y1="420" x2="226" y2="405" stroke={palette.skin} strokeWidth="6" strokeLinecap="round" />
              </g>
            )}
          </motion.g>

          {/* Neck */}
          <rect x="123" y="200" width="34" height="42" rx="14" fill={palette.skin} />

          {/* Hair (Back Layer) */}
          <path
            d={isAria
              ? 'M70,170 C60,110 95,60 140,58 C185,60 220,110 210,170 C210,210 200,235 185,252 L180,180 C180,145 162,125 140,125 C118,125 100,145 100,180 L95,252 C80,235 70,210 70,170 Z'
              : 'M72,165 C62,105 97,58 140,56 C183,58 218,105 208,165 C208,200 200,225 188,240 L182,172 C182,140 164,122 140,122 C116,122 98,140 98,172 L92,240 C80,225 72,200 72,165 Z'}
            fill={palette.hair}
          />

          {/* Hair (Front Layer) */}
          <path
            d={isAria
              ? 'M85,130 C90,85 112,70 140,68 C168,70 190,85 195,130 C178,112 160,105 140,105 C120,105 102,112 85,130 Z'
              : 'M87,125 C92,82 114,68 140,66 C166,68 188,82 193,125 C176,108 158,102 140,102 C122,102 104,108 87,125 Z'}
            fill={palette.hairHighlight}
          />

          {/* Head/Face */}
          <path
            d="M140,66 C178,66 204,98 204,142 C204,180 186,208 162,224 C148,234 144,238 140,238 C136,238 132,234 118,224 C94,208 76,180 76,142 C76,98 102,66 140,66 Z"
            fill={palette.skin}
          />

          {/* Face Shading (Subtle) */}
          <ellipse cx="110" cy="155" rx="14" ry="9" fill="#e0a890" opacity="0.18" />
          <ellipse cx="170" cy="155" rx="14" ry="9" fill="#e0a890" opacity="0.18" />

          {/* Nose */}
          <path
            d="M139.5,138 C141,150 142,158 140,166"
            stroke="#fff"
            strokeOpacity="0.22"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="131" cy="168" rx="2.2" ry="1.5" fill="#000" opacity="0.08" />
          <ellipse cx="149" cy="168" rx="2.2" ry="1.5" fill="#000" opacity="0.08" />

          {/* Eyebrows */}
          <motion.g
            animate={{ rotate: getEyebrowRotation() }}
            transition={{ duration: 0.45 }}
            style={{ transformOrigin: '140px 108px' }}
          >
            <path
              d="M96,106 C106,99 120,99 130,105"
              stroke={palette.brow}
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M150,105 C160,99 174,99 184,106"
              stroke={palette.brow}
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>

          {/* Eyes Group */}
          <motion.g
            animate={{ y: eyesYOffset + gaze.y, x: gaze.x }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Eyelid Crease */}
            <path
              d="M100,118 Q113,113 126,118"
              stroke="#000"
              strokeOpacity="0.1"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M154,118 Q167,113 180,118"
              stroke="#000"
              strokeOpacity="0.1"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Sclera */}
            <motion.ellipse
              cx="113"
              cy="128"
              rx="10"
              ry="12"
              fill="#fdfbf7"
              animate={{ scaleY: eyeScaleY }}
              transition={{ duration: 0.12 }}
              style={{ transformOrigin: '113px 128px' }}
            />
            <motion.ellipse
              cx="167"
              cy="128"
              rx="10"
              ry="12"
              fill="#fdfbf7"
              animate={{ scaleY: eyeScaleY }}
              transition={{ duration: 0.12 }}
              style={{ transformOrigin: '167px 128px' }}
            />

            {/* Iris */}
            <ellipse
              cx="113"
              cy="130"
              rx="5.8"
              ry="6.8"
              fill="#5c453a"
              opacity={isBlinking ? 0 : 1}
            />
            <ellipse
              cx="167"
              cy="130"
              rx="5.8"
              ry="6.8"
              fill="#5c453a"
              opacity={isBlinking ? 0 : 1}
            />
            <ellipse
              cx="113"
              cy="130"
              rx="3.2"
              ry="4"
              fill="#2a1f1a"
              opacity={isBlinking ? 0 : 1}
            />
            <ellipse
              cx="167"
              cy="130"
              rx="3.2"
              ry="4"
              fill="#2a1f1a"
              opacity={isBlinking ? 0 : 1}
            />

            {/* Catchlights */}
            <circle
              cx="116"
              cy="125.5"
              rx="1.8"
              ry="1.8"
              fill="#fff"
              opacity={isBlinking ? 0 : 0.95}
            />
            <circle
              cx="169"
              cy="125.5"
              rx="1.8"
              ry="1.8"
              fill="#fff"
              opacity={isBlinking ? 0 : 0.95}
            />

            {/* Eyelashes */}
            <path
              d="M101,117 L100,114 M107,115 L106,111 M114,114 L114,110"
              stroke={palette.eyeliner}
              strokeOpacity="0.55"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M179,117 L180,114 M173,115 L174,111 M166,114 L166,110"
              stroke={palette.eyeliner}
              strokeOpacity="0.55"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Mouth */}
          <motion.path
            d={getMouthPath()}
            animate={
              state === 'speaking'
                ? {
                    d: [
                      'M112,162 Q130,168 148,162 Q130,170 112,162 Z',
                      'M108,162 Q130,180 152,162 Q130,184 108,162 Z',
                      'M110,162 Q130,172 150,162 Q130,176 110,162 Z',
                      'M106,162 Q130,184 154,162 Q130,188 106,162 Z',
                      'M112,162 Q130,168 148,162 Q130,170 112,162 Z',
                    ],
                  }
                : {}
            }
            transition={
              state === 'speaking'
                ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.4 }
            }
            fill={palette.lips}
          />

          {/* Thinking Dots */}
          {state === 'thinking' && (
            <g>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={205 + i * 14}
                  cy={62}
                  r="4"
                  fill={isAria ? '#4B5563' : '#3FA0DC'}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.18,
                  }}
                />
              ))}
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
}

export default memo(CorporateAvatarSkin);
