import env from '../env';

export function debug(text: string) {
  if (env.DEBUG) console.log(`[DEBUG] ${text}`);
}
