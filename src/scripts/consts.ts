const p = (s: string): string => {
  return '__wizzl.' + s
}

export const WizzlAuthToken = p('token')

export const WizzlDefaultChannel = ''
