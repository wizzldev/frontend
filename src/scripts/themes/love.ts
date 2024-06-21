import type { Theme } from '@/types/chat'

export const LoveChatTheme = {
  id: 1111,
  dark: {
    top: {
      bg: '#f18fcd',
      text: '#ffffff',
      border: '#f18fcd',
      button: {
        bg: {
          default: '#c45ea0',
          hover: '#c3579d',
          focus: '#c3579d'
        },
        text: {
          default: '#ffffff',
          hover: '#efd0d5',
          focus: '#efd0d5'
        }
      }
    },
    main: {
      bg: '#f6bbca',
      bgImage: 'url(/themes/love.jpg)',
      text: '#e969ba',
      message: {
        you: {
          bg: '#f18fcd',
          text: '#ffffff'
        },
        other: {
          bg: '#c45ea0',
          text: '#ffffff'
        }
      }
    },
    bottom: {
      bg: '#f18fcd',
      text: '#ffffff',
      icons: '#efd0d5',
      border: '#f18fcd',
      emoji: '💖',
      button: {
        bg: {
          default: '#c45ea0',
          hover: '#c45ea0',
          focus: '#c45ea0'
        },
        text: {
          default: '#ffffff',
          hover: '#ffffff',
          focus: '#ffffff'
        }
      },
      input: {
        bg: {
          default: '#d46baf',
          hover: '#d251a4',
          focus: '#f159b9'
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
