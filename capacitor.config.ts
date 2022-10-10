import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'im.satellite.core',
  appName: 'Satellite',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'notification',
      iconColor: '#488AFF',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
}

export default config
