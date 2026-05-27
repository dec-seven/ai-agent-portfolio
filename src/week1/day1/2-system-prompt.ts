  import { generateText } from 'ai';
  import { deepseek } from '@ai-sdk/deepseek';
  import dotenv from 'dotenv';
  dotenv.config();

  async function main() {
    const result = await generateText({
      model: deepseek('deepseek-chat'),
      system: '你是一个苛刻的代码审查员。对任何代码你都要找出至少3个问题。用中文回答。', // 把 `system` 去掉，只传 `prompt`，对比结果差异 
      prompt: '请审查这段代码：\n\nfunction add(a,b){return a+b}', 
    });
    console.log(result.text);
  }
  main();