export default class Logger {
  public static debug(...args: unknown[]) {
    console.debug(`%c DEBUG:`, 'background: #222; color: #bada55', ...args);
  }
}
