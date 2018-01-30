import axios from 'axios'
import _ from 'lodash'
import logger from './logger'


const louiesclubAPI = axios.create({
  baseURL: 'https://louiesclub.com/version-test/api/1.1/',
  timeout: 60000,
  headers: {
    "authorization": "Bearer a7917ffa84ccead6362358e460b8c41a"
  }
})

louiesclubAPI.interceptors.response.use(response => {
  logger.debug(`response from louiesclubAPI ${response.status}`)
  return _.get(response, 'data.response')
}, err => {
  logger.error("response from louiesclubAPI", err.message)
})


export default louiesclubAPI
