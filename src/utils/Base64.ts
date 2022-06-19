export default class Base64 {
  static encode(text: string) {
    return Buffer.from(text, 'utf-8').toString('base64');
  }

  static decode(data: string) {
    return Buffer.from(data, 'base64').toString('utf-8');
  }
}
