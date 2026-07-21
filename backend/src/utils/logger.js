const sanitizeData = (data) => {
  if (!data) return data;
  if (typeof data !== 'object') return data;
  
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  const sensitiveKeys = ['password', 'token', 'secret', 'mongoUri', 'passwordHash'];
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  }
  return sanitized;
};

export const logger = {
  info: (msg, meta = null) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta ? sanitizeData(meta) : '');
  },
  warn: (msg, meta = null) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta ? sanitizeData(meta) : '');
  },
  error: (msg, meta = null) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, meta ? sanitizeData(meta) : '');
  }
};
