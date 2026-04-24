exports.handler = async function(event) {
  const page = event.queryStringParameters && event.queryStringParameters.page;
  if (!page || isNaN(parseInt(page))) return { statusCode: 400, body: 'Invalid page' };
  const num = parseInt(page);
  if (num < 1 || num > 604) return { statusCode: 400, body: 'Page out of range' };
  
  const padded = String(num).padStart(3, '0');
  const urls = [
    `https://cdn.islamic.network/quran/images/page${padded}.png`,
    `https://cdn.islamic.network/quran/images/high-resolution/page${padded}.png`
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*'
        },
        body: Buffer.from(buf).toString('base64'),
        isBase64Encoded: true
      };
    } catch(e) { continue; }
  }
  return { statusCode: 500, body: 'Could not fetch page' };
};
