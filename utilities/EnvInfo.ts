import { Capacitor } from '@capacitor/core'

export const EnvInfo = class EnvInfo {
  currentPlatform: string = 'android'
  cpu: any = undefined
  renderer: any = undefined
  debugInfo: any = undefined
  process: any = undefined
  navigator: any = undefined

  constructor() {
    this.currentPlatform = Capacitor.getPlatform()
    this.navigator = navigator

    if (window.navigator.product === 'Gecko') {
      const canvas = document.createElement('canvas')
      let gl
      try {
        gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      } catch (e) {
        console.warn('cannot create webgl canvas')
      }

      if (gl) {
        this.debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        this.cpu = gl.getParameter(this.debugInfo.UNMASKED_VENDOR_WEBGL)
        this.renderer = gl.getParameter(this.debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }
  }
}
