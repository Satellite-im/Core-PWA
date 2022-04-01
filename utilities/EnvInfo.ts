import { Capacitor } from '@capacitor/core'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'

export const EnvInfo = class EnvInfo {
  currentPlatform: PlatformTypeEnum = PlatformTypeEnum.ANDROID
  cpu: any = undefined
  renderer: any = undefined
  debugInfo: any = undefined
  process: any = undefined
  navigator: Navigator = navigator

  constructor() {
    // https://capacitorjs.com/docs/v2/basics/utilities#getplatform
    // their doc has return type of string but lets use an enum
    this.currentPlatform = Capacitor.getPlatform() as PlatformTypeEnum
    this.navigator = navigator

    if (window.navigator.product === 'Gecko') {
      const canvas = document.createElement('canvas')
      let gl
      try {
        gl =
          (canvas.getContext('webgl') as WebGLRenderingContext) ||
          (canvas.getContext('experimental-webgl') as RenderingContext)
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
