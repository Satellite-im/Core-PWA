// import { CapacitorConfig } from '@capacitor/cli'
import { ElectronCapacitorConfig } from '@capacitor-community/electron'

const config: ElectronCapacitorConfig = {
  appId: 'im.satellite.absolute',
  appName: 'Satellite',
  webDir: 'dist',
  bundledWebRuntime: true,
  electron: {
    deepLinkingEnabled: true,
  },
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
