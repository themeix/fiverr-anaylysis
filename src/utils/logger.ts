export enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export class Logger {
  private static format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.format(LogLevel.INFO, message));
  }

  static success(message: string): void {
    console.log(this.format(LogLevel.SUCCESS, message));
  }

  static warning(message: string): void {
    console.warn(this.format(LogLevel.WARNING, message));
  }

  static error(message: string, error?: unknown): void {
    if (error) {
      console.error(this.format(LogLevel.ERROR, message), error);
    } else {
      console.error(this.format(LogLevel.ERROR, message));
    }
  }
}