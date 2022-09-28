import Logger from '~/utilities/Logger'
import { Config } from '~/config'

const logger = new Logger(
  Config.debug
    ? 'debug'
    : process.env.NODE_ENV === 'development' ||
      process.env.NUXT_ENV === 'development'
    ? 'info'
    : 'prod',
)
export default logger
