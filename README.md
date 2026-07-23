# ArenaJoin Site V8

Landing page institucional da ArenaJoin 2027, redesenhada para o novo posicionamento:

**Festival de Cultura Digital e Audiovisual**

O audiovisual é o eixo central. Games, IA, creators, fotografia, cinema, conteúdo e experiências digitais aparecem conectados às novas formas de criação e narrativa.

## Arquitetura

1. Hero
2. Conceito
3. Jornada: ArenaJoin na Escola → ArenaJoin Festival
4. Experiências: Criar, Experimentar, Aprender e Conectar
5. Propósito cultural em Joinville
6. Parcerias
7. Contato

## Publicação no Cloudflare Pages

- Framework: `None`
- Build command: vazio ou `exit 0`
- Output directory: `.`
- Production branch: `main`

## Vídeos opcionais

O site funciona com os pôsteres SVG. Para ativar os vídeos, adicione:

- `assets/media/hero-audiovisual.webm` ou `.mp4`
- `assets/media/escola-loop.webm` ou `.mp4`
- `assets/media/festival-loop.webm` ou `.mp4`

Use loops curtos, sem fala e com até 8–12 MB por arquivo. Qualquer conteúdo falado deve ter legenda.

## Formulário

A função está em `functions/api/submit.js`. Configure no Cloudflare:

- `LEADS_WEBHOOK_URL`
- `LEADS_WEBHOOK_TOKEN` (opcional)

Sem o webhook, o formulário exibirá que o canal de envio ainda não foi configurado.

## Informações provisórias

- Data: 17, 18 e 19 de setembro de 2027, prevista.
- Cidade: Joinville, SC.
- Local, programação, escolas e participantes ainda não confirmados.
- Não comunicar aprovação no FMIC antes da confirmação oficial.
