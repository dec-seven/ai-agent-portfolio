// 工作流程：dotenv 加载环境变量 → deepseek 创建模型实例 → generateText 调用 AI 生成内容

  
  import { generateText } from 'ai';
  /**
   * https://ai-sdk.dev/docs/introduction
   * AI SDK是一个 TypeScript 工具包，旨在帮助开发者使用 React、Next.js、Vue、Svelte、Node.js 等构建 AI 驱动的应用程序和代理。
   * AI SDK 实现了跨受支持提供商集成人工智能 (AI) 模型的标准化。
   * 核心功能
   *  统一的 API 接口调用不同 AI 模型
   *  支持流式响应（streamText）和非流式响应
   *  内置提示词模板、工具调用、结构化输出等高级特性
   *  自动处理重试、错误和超时
   * 
   */
  
  import { deepseek } from '@ai-sdk/deepseek';
  // https://api-docs.deepseek.com/zh-cn/
  // DeepSeek 模型的官方 AI SDK 提供者，将 DeepSeek API 接入 Vercel AI SDK 生态。

  import dotenv from 'dotenv';
  // Node.js 环境变量管理库，从 .env 文件加载配置到 process.env。

  dotenv.config(); // 加载 .env 文件


  async function main() {
    const result = await generateText({
      model: deepseek('deepseek-v4-flash'), //deepseek-v4-pro
      prompt: '用三句话解释什么是 Vue 框架',
      temperature: 0,  // 修改 `temperature` 参数（0 / 0.5 / 1.0 / 1.5），观察同样 prompt 下输出的差异
    });
    console.log('Response:', result.text);
    console.log('Token usage:', result.usage);
  }
  main();