const https = require('https');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { question } = JSON.parse(event.body);
    const KEY = process.env.ANTHROPIC_KEY;
    const payload = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: 'You are Bayān AI Islamic Scholar. Answer questions about Islam using Quran and Hadith evidence. Always cite specific ayahs and hadith with their sources (Bukhari, Muslim etc). End every response with: وَاللَّهُ أَعْلَم (And Allah knows best). Be warm, clear and helpful. Never fabricate references.',
      messages: [{ role: 'user', content: question }]
    });

    const answer = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'x-api-key': KEY,
          'anthropic-version': '2023-06-01'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.content?.[0]?.text || 'Please try again.');
          } catch(e) { resolve('Please try again.'); }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    return { statusCode: 200, headers, body: JSON.stringify({ answer }) };
  } catch(e) {
    return { statusCode: 200, headers, body: JSON.stringify({ answer: 'Something went wrong. Please try again.' }) };
  }
};
