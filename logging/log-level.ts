// Possible log levels: 'error', 'warn', 'info', 'debug', 'trace'
const logLevelData = {
  '*': process.env.LOGGING_LEVEL,
  //   'home': 'info',
  //   'app': 'debug',
}
console.log('log level', process.env.LOGGING_LEVEL)
export default logLevelData
