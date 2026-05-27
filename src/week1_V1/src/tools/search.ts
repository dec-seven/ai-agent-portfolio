/**
 * 搜索工具
 */

import { tool } from "ai";
import z from "zod";

export async function searchWeb({query}:{query:string}): Promise<Record<string,any>> {
  const apiKey = process.env.BOCHA_API_KEY
  const res = await fetch('https://api.bocha.cn/v1/web-search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
    })
  })
  const data = await res.json();

  const results = (data.data.webPages.value || [])
    .slice(0, 3)
    .map((r: { name: string; snippet: string; url: string }) => `${r.name}: ${r.snippet}`)
    .join('\n')
  return { results };
}

export const searchSchema = z.object({
  query: z.string().describe('搜索关键词'),
});

export const searchTool = tool({
  description: '搜索互联网获取实时信息',
  inputSchema: searchSchema,
  execute: searchWeb, 
});