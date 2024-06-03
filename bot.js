import { App, Auth } from 'wizzl'

const app = new App('v1', 'https://mirror1.wizzl.co')
const bot = Auth.new('token')

bot.on('file.Upload', (uploader, file) => {
  uploader.drop(file)
  file.save('https://myuploadserver.com/upload')
  return file
})

app.start(bot)

