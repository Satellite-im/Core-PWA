/**
 * @method stripEXIF
 * @description Strips jpeg file of all EXIF data
 * @param file JPEG file
 * @returns Blob stripped of EXIF data
 * @example
 */

import { EnvInfo } from './EnvInfo'

export const ConsoleWarning = (clientVersion: string, currentState: object) => {
  const envinfo = new EnvInfo()

  console.log(
    '%c⚠️ Do not share anything from console with others. Do not run commands sent by others online.',
    'font-family: Space Mono; color:white; background: #e67e22; border-radius: 2px; padding: 0.5rem;border-right: none;',
  )
  console.log(
    '%c🪲 The following info however can be useful for bug reporting. Click the tag below to show more details.',
    'font-family: Space Mono; color:white; background: #2c3e50; border-radius: 2px; padding: 0.5rem;border-right: none;',
  )
  console.groupCollapsed(
    '%c🛰 Satellite.im%cℹ',
    'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
    'color:white; background: #3498db;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
  )

  console.log(
    `%c${clientVersion}   %cPre-Alpha`,
    'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
    'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
  )
  console.log(
    `%cBrowser %c${envinfo.navigator.vendor}, ${envinfo.navigator.product}`,
    'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
    'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
  )
  console.log(
    `%cLanguage%c${envinfo.navigator.language}`,
    'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
    'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
  )
  console.log(
    `%cPlatform%c${envinfo.currentPlatform}`,
    'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
    'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
  )
  if (envinfo.navigator.onLine) {
    console.log(
      `%cNetwork %cConnected`,
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #2ecc71; border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
    )
  } else {
    console.log(
      `%cNetwork %cOffline`,
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #e74c3c; border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
    )
  }
  console.groupCollapsed(
    `%c📦 Open State`,
    'font-family: Space Mono; color: #222; background: #f1c40f; border-radius: 2px; padding: 0.1rem 0.5rem;border-right: none;',
  )
  console.log(currentState)
  console.groupEnd()
  console.groupEnd()
}
