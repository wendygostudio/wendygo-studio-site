import { readFile, writeFile } from 'node:fs/promises';

const asset = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/fox-slime-jump-frames.webp';
const output = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/painted-fox-slime-jump.html';
const data = (await readFile(asset)).toString('base64');

const fragment = `<section id="painted-fox-slime-jump" class="is-playing">
  <style>
    #painted-fox-slime-jump {
      display: grid;
      justify-items: center;
      gap: 12px;
      color: var(--foreground);
    }
    #painted-fox-slime-jump .sf-frame {
      width: min(100%, 430px);
      aspect-ratio: 405 / 485.5;
      background-image: url("data:image/webp;base64,${data}");
      background-repeat: no-repeat;
      background-size: 400% 200%;
      background-position: 0% 0%;
      border-radius: 16px;
      overflow: hidden;
    }
    #painted-fox-slime-jump.is-playing .sf-frame {
      animation: sf-painted-frames 1.45s step-end forwards;
    }
    #painted-fox-slime-jump .sf-controls { justify-content: center; }
    @keyframes sf-painted-frames {
      0%, 14% { background-position: 0% 0%; }
      14.01%, 27% { background-position: 33.333% 0%; }
      27.01%, 39% { background-position: 66.667% 0%; }
      39.01%, 50% { background-position: 100% 0%; }
      50.01%, 61% { background-position: 0% 100%; }
      61.01%, 72% { background-position: 33.333% 100%; }
      72.01%, 86% { background-position: 66.667% 100%; }
      86.01%, 100% { background-position: 100% 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      #painted-fox-slime-jump.is-playing .sf-frame { animation: none; }
    }
  </style>

  <div class="sf-frame" role="img" aria-label="Secuencia animada pictórica de un zorro-slime saltando y deformando su cuerpo"></div>
  <div class="viz-controls sf-controls">
    <button id="painted-fox-replay" class="btn btn-primary" type="button"><i data-lucide="rotate-ccw" aria-hidden="true"></i> Repetir animación</button>
  </div>
  <span id="painted-fox-status" class="sr-only" aria-live="polite">Animación en reproducción</span>

  <script>
    (() => {
      const root = document.getElementById('painted-fox-slime-jump');
      const replay = document.getElementById('painted-fox-replay');
      const frame = root && root.querySelector('.sf-frame');
      const status = document.getElementById('painted-fox-status');
      if (!root || !replay || !frame || !status) return;
      const play = () => {
        root.classList.remove('is-playing');
        void root.offsetWidth;
        root.classList.add('is-playing');
        status.textContent = 'Animación en reproducción';
      };
      replay.addEventListener('click', play);
      frame.addEventListener('animationend', () => {
        status.textContent = 'Animación completada';
      });
    })();
  </script>
</section>`;

await writeFile(output, fragment, 'utf8');
console.log(output);
