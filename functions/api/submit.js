const allowedTypes = new Set(['publico', 'parceria', 'contato']);

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }
});

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: 'Conteúdo inválido.' }, 400);
  }

  if (body.website) return json({ ok: true });
  if (!body.nome || !body.email || !body.consentimento) {
    return json({ message: 'Preencha os campos obrigatórios.' }, 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(String(body.email))) {
    return json({ message: 'Informe um e-mail válido.' }, 400);
  }

  const tipo = allowedTypes.has(body.tipo) ? body.tipo : 'contato';
  const payload = {
    tipo,
    nome: String(body.nome).slice(0, 120),
    email: String(body.email).slice(0, 180),
    whatsapp: String(body.whatsapp || '').slice(0, 40),
    empresa: String(body.empresa || '').slice(0, 160),
    cargo: String(body.cargo || '').slice(0, 120),
    interesse: String(body.interesse || '').slice(0, 160),
    mensagem: String(body.mensagem || '').slice(0, 3000),
    origem: String(body.origem || '').slice(0, 500),
    enviadoEm: new Date().toISOString()
  };

  if (!env.LEADS_WEBHOOK_URL) {
    return json({ message: 'O canal de envio ainda não foi configurado.' }, 503);
  }

  const upstream = await fetch(env.LEADS_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(env.LEADS_WEBHOOK_TOKEN ? { 'Authorization': `Bearer ${env.LEADS_WEBHOOK_TOKEN}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!upstream.ok) return json({ message: 'Não foi possível registrar o contato agora.' }, 502);
  return json({ ok: true });
}
