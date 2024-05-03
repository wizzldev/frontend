import i18n from '../../i18n'

export type ErrorData = {
  field: string
  tag: string
  value: string | null
}

export type Errors = Record<string, string>

const translateError = (errors: Array<ErrorData>): Errors => {
  const generated: Errors = {}

  errors.forEach((error: ErrorData) => {
    if (error.field.includes('[') && error.field.includes(']')) {
      const arrayFieldKey = error.field.substring(
        error.field.indexOf('[') + 1,
        error.field.lastIndexOf(']')
      )
      generated[error.field.replace('[' + arrayFieldKey + ']', '') + '.' + arrayFieldKey] = t(
        'error.' + error.tag,
        error.value
      )
    } else generated[error.field] = t('error.' + error.tag, error.value)
  })

  return generated
}

const t = (s: string, d: string | null): string => {
  if (d != null) return i18n.global.t(s, d as string)
  return i18n.global.t(s)
}

export default translateError
