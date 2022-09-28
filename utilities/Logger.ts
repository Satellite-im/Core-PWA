/* eslint-disable no-console */

const colors = {
  debug: ['#2ecc71', '#2ecc71', 'white'],
  info: ['#1abc9c', '#1abc9c', 'white'],
  log: ['#34495e', '#3498db', 'white'],
  prod: ['#34495e', '#3498db', 'white'],
  warn: ['#f1c40f', '#f1c40f', 'white'],
  error: ['#e74c3c', '#e74c3c', 'white'],
}

export type LogLevel = 'debug' | 'info' | 'log' | 'prod' | 'warn' | 'error'
export type LogLevelEnum = keyof typeof colors

/**
 * @class
 * @description This method should be used for ALL logging you plan to leave in the application.
 * DO NOT use normal logging, the use of this class will make it easier to enable / disable different log levels.
 */
export default class Logger {
  public level: string
  public lastTime: number
  constructor(
    level: LogLevelEnum = process.env.NODE_ENV === 'production'
      ? 'prod'
      : 'debug',
  ) {
    this.lastTime = Date.now()
    this.level = level
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
  private _log(
    tag: string,
    desc: string,
    data: object,
    level: LogLevelEnum = 'log',
  ) {
    if (level < this.level) {
      return
    }
    const hasData = Object.keys(data).length >= 1
    const newTime = Date.now() - this.lastTime
    ;(hasData ? console.groupCollapsed : console.log)(
      `${newTime}  %c${tag}%c${desc}`,
      `color:${colors[level][2]};background:${colors[level][0]};border-radius:2px 0 0 2px;padding:0.1rem 0.5rem;border-right:none;`,
      `color:${colors[level][2]};background:${colors[level][1]};border-radius:0 2px 2px 0;padding: 0.1rem 0.5rem;border-left: none;`,
    )
    if (hasData) {
      console.log(data)

      console.groupEnd()
    }
    this.lastTime = Date.now()
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
    level: LogLevelEnum = 'prod',
  ) {
    this._log(tag, desc, data, level)
  }

  info(tag: string, desc: string, data: object = {}) {
    this._log(tag, desc, data, 'info')
  }

  warn(tag: string, desc: string, data: object = {}) {
    this._log(tag, desc, data, 'warn')
  }

  error(tag: string, desc: string, data: object = {}) {
    this._log(tag, desc, data, 'error')
  }

  debug(tag: string, desc: string, data: object = {}) {
    this._log(tag, desc, data, 'debug')
  }

  prod(tag: string, desc: string, data: object = {}) {
    this._log(tag, desc, data, 'prod')
  }
}
