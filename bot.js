import { App, Auth } from 'wizzl'

const app = new App('v1', 'https://mirror1.wizzl.co')
const bot = Auth.new('token')

bot.on('file.Upload', (event) => {
  const uploader = event.files.upload
  const files = event.files.get(-1)
  uploader.drop(files)
  files.save('https://myuploadserver.com/upload')
  return event.upload(files)
})

bot.on("chat.Message", (event) => {
  if(["hi", "hello", "hallo"].includes(event.message.raw.toLower())) {
    return event.string(`Hi ${event.sender.first_name}!`)
  }
  return event.pass()
})

app.start(bot)

