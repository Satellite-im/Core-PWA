export enum LogLevel {
  PROD = 'PROD',
  DEV = 'DEV',
}

/**
 * @class
 * @description This method should be used for ALL logging you plan to leave in the application.
 * DO NOT use normal logging, the use of this class will make it easier to enable / disable different log levels.
 */
export default class Logger {
  debug: boolean

  constructor(debug: boolean) {
    this.debug = debug
  }

  /**
   * @method _log
   * @description Internal logging method used to abstract and format logging data.
   * @param tag This is usually the file or feature that is logging
   * @param desc Short description of the log
   * @param data Optional data to log
   * @param level to log to, anything below prod will not be shown unless debug is enabled in the config.
   * @returns Blob stripped of EXIF data
   */
  private _log(tag: string, desc: string, data: object, level: LogLevel) {
    const hasData: boolean = Object.keys(data).length >= 1
    if (level === LogLevel.PROD || this.debug) {
      console[hasData ? 'groupCollapsed' : 'log'](
        `%c${tag}%c${desc}`,
        'color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem; border-right: none;',
        'color:white; background: #3498db; border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
      )
      if (hasData) console.log(data)
      console.groupEnd()
    }
  }

  /**
   * @method _log
   * @description Log data in a formatted manner, programatically.
   * @param tag This is usually the file or feature that is logging
   * @param desc Short description of the log
   * @param data Optional data to log
   * @param level to log to, anything below prod will not be shown unless debug is enabled in the config.
   * @returns Blob stripped of EXIF data
   */
  log(
    tag: string,
    desc: string,
    data: object = {},
    level: LogLevel = LogLevel.PROD,
  ) {
    this._log(tag, desc, data, level)
  }
}
