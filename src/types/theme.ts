export interface ThemeData {
  top: ThemeDataTop
  main: ThemeDataMain
  bottom: ThemeDataBottom
}

export interface ThemeDataTop {
  bg: string
  text: string
  border: string
  button: ThemeDataButton
}

export interface ThemeDataMain {
  bg: string
  bgImage: string
  is_pattern: boolean
  text: string
  message: {
    you: ThemeDataMessage
    other: ThemeDataMessage
  }
}

export interface ThemeDataBottom {
  bg: string
  text: string
  icons: string
  border: string
  emoji: string
  button: ThemeDataButton
  input: ThemeDataButton
}

// components
export interface ThemeDataButton {
  bg: {
    default: string
    hover: string
    focus: string
  }
  text: {
    default: string
    hover: string
    focus: string
  }
}

export interface ThemeDataMessage {
  bg: string
  text: string
}
