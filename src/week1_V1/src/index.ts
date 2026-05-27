import dotenv from 'dotenv';
dotenv.config();

const query = process.argv[2] || '1+1等于几';
const mode = process.argv[3] || 'sdk'; // 'sdk' or 'raw'

if (mode === 'raw') {
  const {reactLoop} = await import('./agents/react-agent');
  await reactLoop(query);
} else {
  const { sdkAgent } = await import('./agents/sdk-agent');
  await sdkAgent(query);
}

