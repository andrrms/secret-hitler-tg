import env from '../env';

export function debug(text: string) {
  if (env.DEBUG) console.log(`[DEBUG] ${text}`);
}

export function randomId(length: number = 8) {
  let str = '';

  for (let i = 0; i < length; i++) {
    str += Math.floor(Math.random() * 9) + 1;
  }

  return +str;
}
