# Mídia audiovisual

O site funciona sem vídeos e usa SVGs conceituais como fallback.

Para ativar a camada audiovisual, adicione:

- `hero-loop.webm` e/ou `hero-loop.mp4`
- `experience-loop.webm` e/ou `experience-loop.mp4`

Recomendações:

- Hero: 1920×1080, 10 a 20 segundos, loop suave, sem texto embutido, até 6 MB no MP4 e preferencialmente menos de 3 MB no WebM.
- Experiência: 1400×1000 ou proporção próxima, 8 a 15 segundos, até 4 MB.
- Evitar imagens de eventos de terceiros apresentadas como ArenaJoin.
- Vídeos com fala precisam de legendas. Atualize `assets/captions/hero-pt.vtt` e adicione `<track>` ao vídeo correspondente.
- O áudio do hero é opcional e só aparece ao usuário quando há vídeo carregado.
