import type { Theme } from '@/types/chat'

export const SpaceChatTheme = {
  id: 3,
  dark: {
    top: {
      bg: '#121c26',
      text: '#ffffff',
      border: '#121c26',
      button: {
        bg: {
          default: '#182532',
          hover: '#1f303f',
          focus: '#1f303f'
        },
        text: {
          default: '#7b7078',
          hover: '#e6b899',
          focus: '#e6b899'
        }
      }
    },
    main: {
      bg: '#111111',
      bgImage: 'url(/themes/space.jpg)',
      text: '#ffffff',
      message: {
        you: {
          bg: '#1e2e3f',
          text: '#ffffff'
        },
        other: {
          bg: '#283c51',
          text: '#ffffff'
        }
      }
    },
    bottom: {
      bg: '#121c26',
      text: '#ffffff',
      icons: '#e6b899',
      border: '#121c26',
      emoji: '🚀',
      button: {
        bg: {
          default: '#182532',
          hover: '#1f303f',
          focus: '#1f303f'
        },
        text: {
          default: '#ffffff',
          hover: '#ffffff',
          focus: '#ffffff'
        }
      },
      input: {
        bg: {
          default: '#182532',
          hover: '#1f303f',
          focus: '#1f303f'
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
