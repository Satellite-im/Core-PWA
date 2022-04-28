import DetectRTC from 'detectrtc'

export type PermissionRequestOptions = MediaStreamConstraints | undefined

interface permissionObject {
  hasWebcam: Boolean
  hasMicrophone: Boolean
  hasSpeakers: Boolean
  browser: String
  permissions: {
    webcam: Boolean
    microphone: Boolean
  }
  devices: {
    audioIn: any[]
    audioOut: any[]
    videoIn: any[]
  }
  blocked: {
    audio: Boolean
    video: Boolean
  }
}

interface Device {
  text: string
  value: string
}

/**
 * @method formatDevices DocsTODO
 * @description
 * @param devices
 * @returns
 * @example
 */
const formatDevices = (devices: any[]) => {
  const responsearray: Device[] = []
  devices.forEach((device) => {
    // Chrome based browsers add a 'default' item that is a duplicate of another item in the list. This prevents that from going into the options the user sees.
    // The default capture devices will be listed first - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
    if (!device.label.includes('Default - ')) {
      const item = {
        text: device.label as string,
        value: device.deviceId as string,
      } as Device

      responsearray.push(item)
    }
  })
  return responsearray
}

/**
 * @method getRTC
 * @description Gets users RTC info (devices, permissions, browser, etc.)
 * @returns Promise that resolves to responseObject with RTC info
 * @example const UserPermissions = await this.$props.getRTC()
 */
const getRTC = async () => {
  const promise = await new Promise((resolve) => {
    const responseObject: permissionObject = {
      hasWebcam: false,
      hasMicrophone: false,
      hasSpeakers: false,
      browser: 'Chrome',
      permissions: {
        webcam: false,
        microphone: false,
      },
      devices: {
        audioIn: [],
        audioOut: [],
        videoIn: [],
      },
      blocked: {
        audio: false,
        video: false,
      },
    }
    DetectRTC.load(() => {
      responseObject.hasWebcam = DetectRTC.hasWebcam
      responseObject.hasMicrophone = DetectRTC.hasMicrophone
      responseObject.hasSpeakers = DetectRTC.hasSpeakers
      responseObject.browser = DetectRTC.browser.name

      if (DetectRTC.isWebsiteHasWebcamPermissions) {
        responseObject.permissions.webcam =
          DetectRTC.isWebsiteHasWebcamPermissions
        responseObject.devices.videoIn = formatDevices(
          DetectRTC.videoInputDevices,
        )
      }
      if (DetectRTC.isWebsiteHasMicrophonePermissions) {
        responseObject.permissions.microphone =
          DetectRTC.isWebsiteHasMicrophonePermissions
        const audioOut = formatDevices(DetectRTC.audioOutputDevices)
        responseObject.devices.audioOut = audioOut
        const audioIn = formatDevices(DetectRTC.audioInputDevices)
        responseObject.devices.audioIn = audioIn
      }
      resolve(responseObject)
    })
  }).catch((err) => {
    throw err
  })

  return promise
}

export const UserPermissions = {
  created: () => {
    // can add functions here on start-up if needed
  },
  methods: {
    /**
     * @method getUserPermissions DocsTODO
     * @description Uses getRTC method to return users RTC info
     * @returns Object with users RTC info
     * @example
     */
    async getUserPermissions(): Promise<any> {
      // Todo: Firefox does not allow querying for Microphone https://github.com/mozilla/standards-positions/issues/19, and is spotty in it's implementation of the permissions api
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1609427
      return await getRTC()
    },
    /**
     * @method requestUserPermissions DocsTODO
     * @description Requests user permission to access their media devices such as webcams and microphones
     * @param permission Object with contraints for which permissions to request
     * @returns Promise that resolves to a MediaStream object
     * @example
     */
    async requestUserPermissions(
      permission: PermissionRequestOptions,
    ): Promise<any> {
      return await navigator.mediaDevices.getUserMedia(permission)
    },
  },
}

export default UserPermissions

export const exportForTesting = {
  formatDevices,
}
