import { appendFileSync } from 'fs';
import { join } from 'path';

/**
 * 创建日志记录器
 * @param logFileName 日志文件名（默认 'app.log'）
 * @param logDir 日志文件所在目录（默认为当前工作目录）
 * @returns 日志函数
 */
export function createLogger(logFileName: string = 'app.log', logDir?: string) {
  const logFilePath = logDir
    ? join(logDir, logFileName)
    : join(process.cwd(), logFileName);

  // 追加分隔线（不清空已有日志）
  const separator = '\n' + '='.repeat(60) + '\n';
  const header = `=== Log started at ${new Date().toISOString()} ===\n`;
  appendFileSync(logFilePath, separator + header);

  /**
   * 写入日志
   * @param message 日志消息
   * @param printToConsole 是否同时输出到控制台（默认 true）
   */
  return function log(message: string, printToConsole: boolean = true): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    appendFileSync(logFilePath, logMessage);
    if (printToConsole) {
      console.log(message);
    }
  };
}

/**
 * 创建一个与调用文件同级的日志记录器
 * @param callerDir 调用文件的目录路径
 * @param logFileName 日志文件名
 * @returns 日志函数
 */
export function createLocalLogger(callerDir: string, logFileName: string = 'app.log') {
  const logFilePath = join(callerDir, logFileName);

  // 追加分隔线（不清空已有日志）
  const separator = '\n' + '='.repeat(60) + '\n';
  const header = `=== Log started at ${new Date().toISOString()} ===\n`;
  appendFileSync(logFilePath, separator + header);

  /**
   * 写入日志
   * @param message 日志消息
   * @param printToConsole 是否同时输出到控制台（默认 true）
   */
  return function log(message: string, printToConsole: boolean = true): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    appendFileSync(logFilePath, logMessage);
    if (printToConsole) {
      console.log(message);
    }
  };
}
