exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  
  let email, password;
  try {
    const body = JSON.parse(event.body || '{}');
    email = body.email;
    password = body.password;
  } catch(e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) };
  }
  
  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing credentials' }) };
  }

  const SB_URL = 'https://ogvitadvqzvdvxgbbnhz.supabase.co';
  const SB_KEY = process.env.SUPABASE_ANON_KEY || process.env.SB_KEY || '';

  try {
    const response = await fetch(SB_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
