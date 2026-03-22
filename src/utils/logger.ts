import { ENV } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

export class Logger {
  private readonly level: number;

  constructor(private readonly scope: string) {
    this.level = LEVELS[(ENV.LOG_LEVEL as LogLevel) || 'info'] ?? LEVELS.info;
  }

  debug(msg: string): void {
    if (this.level <= LEVELS.debug) console.log(`  [DBG] [${this.scope}] ${msg}`);
  }

  info(msg: string): void {
    if (this.level <= LEVELS.info) console.log(`  [INFO] [${this.scope}] ${msg}`);
  }

  warn(msg: string): void {
    if (this.level <= LEVELS.warn) console.warn(`  [WARN] [${this.scope}] ${msg}`);
  }

  error(msg: string): void {
    if (this.level <= LEVELS.error) console.error(`  [ERROR] [${this.scope}] ${msg}`);
  }
}