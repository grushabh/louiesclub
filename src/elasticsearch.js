import config from 'config'
import elasticsearch from 'elasticsearch'
const client = new elasticsearch.Client(config.elasticsearch)


export default client
