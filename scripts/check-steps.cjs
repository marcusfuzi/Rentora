const fs = require('fs');
const transcriptPath = 'C:/Users/bisht/.gemini/antigravity/brain/84837dc9-d2cd-4064-bc1e-cf3fd79794cc/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(transcriptPath)) {
  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
  lines.forEach(l => {
    if (!l.trim()) return;
    try {
      const data = JSON.parse(l);
      if (data.content && data.content.includes('[Browser Step')) {
        const match = data.content.match(/"intent":"([^"]+)"/);
        console.log(`Step ${data.step_index}:`, match ? match[1] : 'No intent');
      }
    } catch(e) {}
  });
}
