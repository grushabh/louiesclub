import config from 'config'
import logger from './logger'
import app from './app'

logger.warn('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
logger.info("listen on ", config.listen)


app.listen(config.listen.httpPort)
