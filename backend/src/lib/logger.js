const createLogger = (requestId = 'unknown') => {
  const format = (level, message, context) => ({
    level,
    message,
    requestId,
    ...(context ? { context } : {}),
  });

  return {
    info: (message, context) => {
      if (globalThis?.console) {
        globalThis.console.log(JSON.stringify(format('info', message, context)));
      }
    },
    warn: (message, context) => {
      if (globalThis?.console) {
        globalThis.console.warn(JSON.stringify(format('warn', message, context)));
      }
    },
    error: (message, context) => {
      if (globalThis?.console) {
        globalThis.console.error(JSON.stringify(format('error', message, context)));
      }
    },
  };
};

export { createLogger };
