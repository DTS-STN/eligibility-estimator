import pino, { Logger, stdTimeFunctions } from 'pino'

import logLevelData from './log-level'

const logLevels = new Map<string, string | undefined>(
  Object.entries(logLevelData)
)

export function getLogLevel(logger: string): string {
  return logLevels.get(logger) || logLevels.get('*') || 'info'
}

export function getLogger(logger: string): Logger {
  return pino({
    logger,
    // Shows logs with log level `level` or higher
    level: getLogLevel(logger),
    // Pass custom pino formatters (these are ignored when: `pretty: true`)
    // Pino Documentation: https://github.com/pinojs/pino/blob/master/docs/api.md#formatters-object
    formatters: {
      // This will log levels as strings instead of the default numbers
      level(label, level) {
        return { level: label.toLocaleUpperCase() }
      },
    },
    // Enables or disables the inclusion of a timestamp in the log message (with `true` or `false`)
    timestamp: stdTimeFunctions.isoTime,
  })
}
