import type { Theme } from '@/types/chat'

export const SummerChatTheme = {
  id: 2,
  dark: {
    top: {
      bg: '#19506e',
      text: '#ffffff',
      border: '#ffffff',
      button: {
        bg: {
          default: '#9092a7',
          hover: '#95b0c7',
          focus: '#9092a7'
        },
        text: {
          default: '#ffffff',
          hover: '#ffffff',
          focus: '#ffffff'
        }
      }
    },
    main: {
      bg: '#68819f',
      bgImage: 'url(/themes/summer.jpg)',
      text: '#888888',
      message: {
        you: {
          bg: '#91aec4',
          text: '#ffffff'
        },
        other: {
          bg: '#048fab',
          text: '#ffffff'
        }
      }
    },
    bottom: {
      bg: '#19506e',
      text: '#ffffff',
      icons: '#ffffff',
      border: '#ffffff',
      emoji: '🏖️',
      button: {
        bg: {
          default: '#9092a7',
          hover: '#9092a7',
          focus: '#9092a7'
        },
        text: {
          default: '#ffffff',
          hover: '#ffffff',
          focus: '#ffffff'
        }
      },
      input: {
        bg: {
          default: '#9092a7',
          hover: '#9092a7',
          focus: '#9092a7'
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
