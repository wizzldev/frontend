import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.wizzl.app',
  appName: 'Wizzl',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  android: {
    overrideUserAgent: 'Wizzl/1.0 (Android)'
  }
};

export default config;
