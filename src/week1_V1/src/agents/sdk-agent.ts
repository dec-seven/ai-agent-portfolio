/**
 * SDK版
 */

import { deepseek } from "@ai-sdk/deepseek";
import { stepCountIs, ToolLoopAgent } from "ai";
import { sdkTools } from "../tools";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createLocalLogger } from "../../../utils/logger";


// ====== 日志工具 ======
const __dirname = dirname(fileURLToPath(import.meta.url));
const log = createLocalLogger(__dirname, 'sdk-agent.log');

export async function sdkAgent(query: string) {
  const agent = new ToolLoopAgent({
    model: deepseek('deepseek-chat'),
    instructions: `你是一个研究助手。遇到计算问题用计算器，需要实时信息用搜索。`,
    tools: sdkTools,
    stopWhen: stepCountIs(10)
  })

  const result = await agent.generate({ prompt: query })

  log('\n=== Final Answer ===');
  log(result.text);
  log(`Steps taken: ${result.steps?.length}`);
  log(`Total tokens: ${JSON.stringify(result.usage)}`);
}
