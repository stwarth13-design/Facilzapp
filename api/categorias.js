const FACILZAP_BASE = 'https://api.facilzap.app.br';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
    const response = await fetch(`${FACILZAP_BASE}/categorias`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao contatar a API do FácilZap.', detail: err.message });
  }
}
