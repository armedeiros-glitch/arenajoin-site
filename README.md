# ArenaJoin Site V6

Versão com escala tipográfica, composição desktop/mobile e aplicações de marca revisadas.

# ArenaJoin Site V4

Landing page institucional da ArenaJoin com audiovisual em posição estratégica para sustentar o projeto cultural sem afirmar aprovação, programação ou local confirmados.

## Principais mudanças da V4

- Audiovisual incluído no hero.
- Seção editorial “Cultura digital em movimento” no primeiro terço da página.
- Núcleo Audiovisual apresentado como linguagem transversal, não como arena física confirmada.
- Oficina de Criação de Personagens e Construção de Figurinos em destaque.
- Audiovisual e Novas Narrativas passa a abrir a grade de universos.
- Cultura e formação reorganizadas para território, acesso, acessibilidade e acervo.
- Formulários preparados para mapear interesses audiovisuais.
- FAQ específico sobre o papel do audiovisual.
- Hero conceitual reinterpretado como lente, enquadramento e produção, reduzindo a leitura de “portal gamer”.

## Publicação local

Abra `index.html` ou rode um servidor local:

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`.

## Publicação no GitHub Pages

1. Crie ou escolha um repositório.
2. Envie todos os arquivos desta pasta para a raiz.
3. Em **Settings > Pages**, selecione a branch principal e a pasta raiz.
4. Configure o domínio próprio.

## Publicação no Cloudflare Pages

- Framework preset: `None`.
- Build command: vazio.
- Output directory: `/`.
- Para formulários, configure `LEADS_WEBHOOK_URL` nas variáveis do projeto.

## Pendências antes da versão pública

- Substituir `assets/logo-arenajoin.svg` e `assets/favicon.svg` pelos arquivos vetoriais oficiais.
- Definir o destino real dos formulários.
- Confirmar domínio e atualizar canonical, Open Graph, sitemap e robots.
- Produzir hero em vídeo próprio.
- Revisar política de privacidade com os dados do responsável legal.

## Estrutura

- `index.html`: landing page.
- `styles.css`: identidade, responsividade e motion.
- `script.js`: navegação, formulários, mídia opcional e acessibilidade.
- `site.config.js`: links e endpoint.
- `functions/api/submit.js`: função para formulários em Cloudflare Pages.
- `assets/`: logo provisório, posters e mídia futura.
- `docs/`: arquitetura, direção audiovisual e informações provisórias.
