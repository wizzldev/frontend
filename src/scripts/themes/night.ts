import type { Theme } from '@/types/chat'

export const NightChatTheme = {
  id: 11,
  dark: {
    top: {
      bg: '#262835',
      text: '#ffffff',
      border: '#262835',
      button: {
        bg: {
          default: '#2b2e3c',
          hover: '#323646',
          focus: '#323646'
        },
        text: {
          default: '#593471',
          hover: '#623a7b',
          focus: '#623a7b'
        }
      }
    },
    main: {
      bg: '#5e5499',
      bgImage: 'url(/themes/night.jpg)',
      text: '#e969ba',
      message: {
        you: {
          bg: '#6a3e61',
          text: '#ffffff'
        },
        other: {
          bg: '#a1333a',
          text: '#ffffff'
        }
      }
    },
    bottom: {
      bg: '#1b2725',
      text: '#ffffff',
      icons: '#efd0d5',
      border: '#1b2725',
      emoji: '🌃',
      button: {
        bg: {
          default: '#402f43',
          hover: '#48354c',
          focus: '#48354c'
        },
        text: {
          default: '#ffffff',
          hover: '#ffffff',
          focus: '#ffffff'
        }
      },
      input: {
        bg: {
          default: '#402f43',
          hover: '#48354c',
          focus: '#48354c'
        },
        text: {
          default: '#ffffff',
          hover: '#ffffff',
          focus: '#ffffff'
        }
      }
    }
  }
} as Theme