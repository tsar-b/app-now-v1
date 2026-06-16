export const log = {
  info: (message) => console.log(`[appnow] ${message}`),
  warn: (message) => console.warn(`[appnow:warn] ${message}`),
  error: (message) => console.error(`[appnow:error] ${message}`)
};
