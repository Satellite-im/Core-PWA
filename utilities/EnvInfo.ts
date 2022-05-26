import { PlatformTypeEnum } from '~/libraries/Enums/enums'

const getPlatform = () => {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera

  if (/android/i.test(userAgent)) {
    return 'android'
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios'
  }

  return 'web'
}

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
    this.currentPlatform = getPlatform() as PlatformTypeEnum
    this.navigator = navigator

    if (window.navigator.product === 'Gecko') {
      const canvas = document.createElement('canvas')
      try {
        const gl = (canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl')) as WebGLRenderingContext
        if (gl) {
          this.debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
          this.cpu = gl.getParameter(this.debugInfo.UNMASKED_VENDOR_WEBGL)
          this.renderer = gl.getParameter(
            this.debugInfo.UNMASKED_RENDERER_WEBGL,
          )
        }
      } catch (e) {
        console.warn('cannot create webgl canvas')
      }
    }
  }
}
