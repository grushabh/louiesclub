import { colorConsole } from 'tracer'
import config from 'config'

console.log("config", config)

const logger = colorConsole(config.log.level)

export default logger
