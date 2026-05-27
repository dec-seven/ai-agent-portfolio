/**
 * 计算器工具
 */

import { tool } from "ai";
import z from "zod";

// tools/calculator/index.ts
export function calculate({ expression }: { expression: string }): Record<string, any> {
  try {
    // 安全地用 eval
    const result = Function('"use strict"; return (' + expression + ')')();
    return { result, expression };
  } catch (e) {
    return { error: String(e), expression };
  }
}

export const calculatorSchema = z.object({
  expression: z.string().describe('数学表达式'),
});

export const calculatorTool = tool({
  description: '执行数学计算',
  inputSchema: z.object({ expression: z.string().describe('数学表达式') }),
  execute: calculate
});