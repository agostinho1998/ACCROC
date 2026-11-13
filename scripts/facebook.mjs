// Vai buscar os últimos posts da página de Facebook da ACCROC e gera:
//   data/noticias.json – os 3 últimos posts (sem #evento)
//   data/eventos.json  – os posts com #evento cuja data ainda não passou
//
// Precisa de dois "secrets" no GitHub (Settings → Secrets and variables → Actions):
//   FB_PAGE_ID     – o ID numérico da página de Facebook
//   FB_PAGE_TOKEN  – a chave de página (Page access token) com pages_read_engagement
//
// Regra para os eventos (no texto do post):
//   1.ª linha: nome do evento
//   Data: 20/06/2027
//   Local: Largo da aldeia        (opcional)
//   #evento

import { writeFile, readFile } from 'node:fs/promises';

const PAGE_ID = process.env.FB_PAGE_ID;
const TOKEN = process.env.FB_PAGE_TOKEN;
const API = 'https://graph.facebook.com/v25.0';

if (!PAGE_ID || !TOKEN) {
  console.log('FB_PAGE_ID ou FB_PAGE_TOKEN em falta: nada a fazer (o site mantém os exemplos).');
  process.exit(0);
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dataPT = (d) => `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;

async function getPosts() {
  const fields = 'message,full_picture,permalink_url,created_time';
  const url = `${API}/${PAGE_ID}/posts?fields=${fields}&limit=50&access_token=${encodeURIComponent(TOKEN)}`;
  const r = await fetch(url);
  const j = await r.json();
  if (!r.ok || j.error) throw new Error('Facebook respondeu com erro: ' + JSON.stringify(j.error || r.status));
  return j.data || [];
}

function lerEvento(post) {
  const linhas = (post.message || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const titulo = (linhas[0] || '').replace(/#evento/gi, '').trim();
  const dataLinha = linhas.find((l) => /^data\s*:/i.test(l));
  const localLinha = linhas.find((l) => /^local\s*:/i.test(l));
  if (!titulo || !dataLinha) return null;
  const m = dataLinha.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/);
  if (!m) return null;
  const [, dd, mm, aaaa] = m;
  const iso = `${aaaa}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  const d = new Date(iso + 'T00:00:00Z');
  return {
    title: titulo,
    date: dataPT(d),
    place: localLinha ? localLinha.replace(/^local\s*:\s*/i, '') : '',
    iso,
    image: post.full_picture || null,
    link: post.permalink_url,
  };
}

function resumo(texto, max = 160) {
  const t = (texto || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}

async function escreverSeMudou(path, obj) {
  const novo = JSON.stringify(obj, null, 2) + '\n';
  let antigo = '';
  try { antigo = await readFile(path, 'utf8'); } catch {}
  const semData = (s) => s.replace(/"atualizado": "[^"]*"/, '');
  if (semData(antigo) === semData(novo)) { console.log(path, 'sem alterações'); return; }
  await writeFile(path, novo);
  console.log(path, 'atualizado');
}

const posts = await getPosts();
const hoje = new Date().toISOString().slice(0, 10);
const agora = new Date().toISOString();

const eventos = posts
  .filter((p) => /#evento/i.test(p.message || ''))
  .map(lerEvento)
  .filter((e) => e && e.iso >= hoje)
  .sort((a, b) => a.iso.localeCompare(b.iso));

const noticias = posts
  .filter((p) => p.message && !/#evento/i.test(p.message))
  .slice(0, 3)
  .map((p) => ({
    date: dataPT(new Date(p.created_time)),
    text: resumo(p.message),
    image: p.full_picture || null,
    link: p.permalink_url,
  }));

await escreverSeMudou('data/noticias.json', { atualizado: agora, exemplo: false, posts: noticias });
await escreverSeMudou('data/eventos.json', { atualizado: agora, exemplo: false, eventos });
