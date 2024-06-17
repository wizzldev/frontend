export const cdnImage = (url: string, size: number|undefined = undefined) => {
  if(url.includes('://')) return url
  let img = ""
  if(size == undefined) img = url
  else {
    const data = url.split(".")
    img = `${data[0]}-s${size}.${data[1]}`
  }
  return `${window.GLOBAL_ENV.CDN_HOST}/avatars/${img}`
}

export const chatImage = (url: string) => {
  return window.GLOBAL_ENV.API_ENDPOINT + url
}