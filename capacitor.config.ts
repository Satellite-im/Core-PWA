import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'im.satellite.absolute',
  appName: 'Satellite',
  webDir: 'dist',
  bundledWebRuntime: true,
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
