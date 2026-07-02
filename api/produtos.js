const FACILZAP_BASE = 'https://api.facilzap.app.br';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.FACILZAP_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: 'FACILZAP_TOKEN não configurado nas variáveis de ambiente da Vercel.'
    });
  }

  try {
    if (req.method === 'GET') {
      const query = req.url.includes('?') ? req.url.split('?')[1] : '';
      const url = `${FACILZAP_BASE}/produtos${query ? '?' + query : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (req.method === 'POST') {
      const response = await fetch(`${FACILZAP_BASE}/produtos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: 'Método não permitido. Use GET ou POST.' });
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao contatar a API do FácilZap.', detail: err.message });
  }
}
