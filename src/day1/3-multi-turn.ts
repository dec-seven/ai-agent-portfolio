import { generateText } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import dotenv from 'dotenv'

dotenv.config();

const chart  = async () => {
  const history: Array<{role: 'user'|'assistant', content: string}> = [];

  const r1 = await generateText({
    model: deepseek('deepseek-chat'),
    system: '你是一个 SQL 专家，用中文回答。',
    messages:[
      ...history,
      { role: 'user' as const, content: '如何查询销量前10的商品？' }
    ]
  })
  history.push({ role: 'user', content: '如何查询销量前10的商品？' });
  history.push({ role: 'assistant', content: r1.text });
  console.log('Turn 1:', r1.text);
  
  const r2 = await generateText({
    model: deepseek('deepseek-chat'),
    system: '你是一个 SQL 专家，用中文回答。',
    messages:[
      // ...history,  // 这里不传历史消息，观察结果差异
      { role: 'user' as const, content: '加上按月份分组' }
    ]
  })
  console.log('Turn 2:', r2.text);
}

chart()