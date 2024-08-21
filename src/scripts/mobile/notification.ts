import { PushNotifications } from '@capacitor/push-notifications'
import type { AxiosInstance } from 'axios'
import { isApp } from '@/scripts/mobile/isApp'
import type { Router } from 'vue-router'

export const addListeners = async (request: AxiosInstance, router: Router) => {
  if(!isApp()) return

  await PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value)
    request.post('/mobile/register-push-notification', { token: token.value })
  })

  await PushNotifications.addListener('registrationError', error => {
    console.error('Registration error: ', error)
  })

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push notification received: ', notification);
  })

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
    const data = notification.notification.data as { chat_id?: string }
    if(data.chat_id) router.push({name: 'chat.message', params: {id: data.chat_id}})
  })

  return await registerNotifications()
}

const registerNotifications = async (): Promise<boolean> => {
  let permStatus = await isNotificationsAllowed();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    return false
  }

  await PushNotifications.register();

  return true
}

export const isNotificationsAllowed = async () => {
  return await PushNotifications.checkPermissions();
}