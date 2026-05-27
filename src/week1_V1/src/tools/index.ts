import { calculate, calculatorTool } from './calculator';
import { searchWeb, searchTool } from './search';

// ====== 裸写版用的 ======
export const rawTools: Record<string, Function> = {
  calculator: calculate,     // (expression) => string
  search: searchWeb,        // (query) => Promise<string>
};

// ====== SDK 版用的 ======
export const sdkTools = {
  calculator: calculatorTool,
  search: searchTool
};
