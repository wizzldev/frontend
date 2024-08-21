const p = (s: string): string => {
  return '__wizzl.' + s
}

export const WizzlAuthToken = p('token')
export const WizzlGroupMakeSave = p('groupMake')
export const WizzlTermsAccepted = p('terms_and_conditions')

export const WizzlDefaultChannel = 'ws.default'

export const WizzlCachePiniaChat = 'wizzl.cache.pinia.chat'