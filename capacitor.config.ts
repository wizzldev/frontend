import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wizzl.app',
  appName: 'Wizzl',
  webDir: 'dist',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
  },
  android: {
    appendUserAgent: 'Wizzl/1.0 (Android)'
  }
};

export default config;
