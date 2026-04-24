exports.handler = async function(event) {
  const page = event.queryStringParameters && event.queryStringParameters.page;
  if (!page || isNaN(parseInt(page))) {
    return { statusCode: 400, body: 'Invalid page' };
  }
  
  const num = parseInt(page);
  if (num < 1 || num > 604) {
    return { statusCode: 400, body: 'Page out of range' };
  }
  
  const padded = String(num).padStart(3, '0');
  const url = `https://cdn.islamic.network/quran/images/page${padded}.png`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Try high-res fallback
      const url2 = `https://cdn.islamic.network/quran/images/high-resolution/page${padded}.png`;
      const response2 = await fetch(url2);
      if (!response2.ok) throw new Error('Both CDNs failed');
      const buffer = await response2.arrayBuffer();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*'
        },
        body: Buffer.from(buffer).toString('base64'),
        isBase64Encoded: true
      };
    }
    const buffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch(e) {
    return { statusCode: 500, body: e.message };
  }
};
