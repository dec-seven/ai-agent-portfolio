/**
 * 手写ReAct版
 */

import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createLocalLogger } from "../../../utils/logger";
import { rawTools } from "../tools";

// ====== 日志工具 ======
const __dirname = dirname(fileURLToPath(import.meta.url));
const log = createLocalLogger(__dirname, 'react-agent.log');

//  ====== ReAct System Prompt ======
const REACT_SYSTEM_PROMPT = `你是一个智能助手，当前日期是 ${new Date().toLocaleDateString('zh-CN')}，可以使用工具来完成任务。
  当被问到近期/当年数据时，优先使用搜索工具获取实时信息，不要凭训练数据回答。
  回答时请严格遵循以下格式：

  Thought: 分析当前情况，决定下一步做什么
  Action: 工具名称[参数]
  Observation: (工具执行结果，由系统填入)

  重复 Thought → Action → Observation 直到你能够给出最终答案。
  当你准备给出最终答案时，使用：

  Final Answer: 你的最终回答

  可用工具：
  - calculator[数学表达式]：执行数学计算
  - search[查询关键词]：搜索互联网获取信息`;

//  ====== 解析 LLM 实现 ======
function parseAction(text: string): {tool:string; param: string} | null {
  const actionMatch = text.match(/Action:\s*(\w+)\s*\[(.+?)\]/);
  
  if (actionMatch) {
    return { tool: actionMatch[1], param: actionMatch[2] };
  }
  return null;
}

function isFinalAnswer(text: string): string| null {
  
  const finalMatch = text.match(/Final Answer:\s*(.+)/);
  return finalMatch ? finalMatch[1].trim() : null;
}

//  ===== 主循环 =====
export async function reactLoop(userQuery: string, maxSteps = 10) {
  
  const messages: Array<{role:string; content:string}> = [
    { role: 'system', content: REACT_SYSTEM_PROMPT },
    { role: 'user', content: userQuery },
  ];

  for (let step = 0; step < maxSteps; step++) {
    log(`\n === Step ${step + 1} ===`);
    
    const result = await generateText({
      model: deepseek('deepseek-chat'),
      messages: messages as any,
    });

    const text = result.text;
    log('LLM Output:\n' + text);

    // ① 先解析 Action（优先于 Final Answer）
    const action = parseAction(text);

    // ② 有 Action → 强制执行工具，忽略 LLM 可能编造的后续内容
    if (action) {
      const toolFn = rawTools[action.tool];
      const observation = await toolFn({query: action.param , expression: action.param });  // 直接调用纯函数

      log(`🔧 Tool: ${action.tool}[${action.param}]`);
      log(`📊 Observation: ${observation.results}`);

      // ③ 截断：只把到 Action 为止的内容塞回 messages，不污染上下文
      const actionEndIndex = text.indexOf(']') + 1;
      messages.push({ role: 'assistant', content: text.substring(0, actionEndIndex) });
      messages.push({ role: 'user', content: `Observation: ${observation.results}` });

      continue; // 进入下一轮循环
    }

    // ④ 没有 Action → 再检查 Final Answer
    const final = isFinalAnswer(text);
    if(final){
      log('\n✅ Final Answer: ' + final);
      return final;
    }

    log('⚠️ No Action or Final Answer found, stopping');
    return text;

  }

  log('⚠️ Max steps reached');
  return 'Agent 未能在最大步数内完成任务';
}