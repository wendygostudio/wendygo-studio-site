import { readFile, writeFile } from 'node:fs/promises';

const asset = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/fox-slime-16-frames.webp';
const output = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/fox-slime-left-to-right.html';
const data = (await readFile(asset)).toString('base64');

const fragment = `<section id="fox-slime-left-to-right" class="is-playing">
  <style>
    #fox-slime-left-to-right {
      display: grid;
      gap: 12px;
      color: var(--foreground);
    }
    #fox-slime-left-to-right .sf-stage {
      position: relative;
      width: 100%;
      aspect-ratio: 720 / 330;
      min-height: 230px;
      overflow: hidden;
      border-radius: 16px;
      background:
        radial-gradient(circle at 78% 18%, color-mix(in srgb, var(--viz-series-1) 14%, transparent) 0 8%, transparent 24%),
        linear-gradient(180deg, color-mix(in srgb, var(--viz-series-3) 20%, var(--background)), var(--background) 72%);
    }
    #fox-slime-left-to-right .sf-stage::before {
      content: "";
      position: absolute;
      inset: 55% 0 0;
      background:
        radial-gradient(ellipse at 15% 20%, color-mix(in srgb, var(--viz-series-3) 32%, transparent), transparent 58%),
        radial-gradient(ellipse at 82% 28%, color-mix(in srgb, var(--viz-series-3) 28%, transparent), transparent 54%),
        linear-gradient(180deg, color-mix(in srgb, var(--viz-series-3) 24%, var(--card)), var(--card));
      opacity: .9;
    }
    #fox-slime-left-to-right .sf-stage::after {
      content: "";
      position: absolute;
      left: 4%;
      right: 4%;
      bottom: 12%;
      height: 10%;
      border-radius: 50%;
      background: var(--foreground);
      opacity: .10;
      filter: blur(12px);
    }
    #fox-slime-left-to-right .sf-traveler {
      position: absolute;
      z-index: 2;
      left: 0;
      top: 50%;
      width: 50%;
      aspect-ratio: 404.75 / 242.75;
      transform: translate(0, -50%);
    }
    #fox-slime-left-to-right.is-playing .sf-traveler {
      animation: sf-travel 1.5s linear forwards;
    }
    #fox-slime-left-to-right .sf-sprite {
      width: 100%;
      height: 100%;
      background-image: url("data:image/webp;base64,${data}");
      background-repeat: no-repeat;
      background-size: 400% 400%;
      background-position: 0% 0%;
      -webkit-mask-image: radial-gradient(ellipse 68% 68% at 50% 53%, #000 54%, transparent 98%);
      mask-image: radial-gradient(ellipse 68% 68% at 50% 53%, #000 54%, transparent 98%);
    }
    #fox-slime-left-to-right.is-playing .sf-sprite {
      animation: sf-fox-frames 1.5s step-end forwards;
    }
    #fox-slime-left-to-right .sf-controls { justify-content: center; }
    @keyframes sf-travel {
      from { transform: translate(0, -50%); }
      to { transform: translate(100%, -50%); }
    }
    @keyframes sf-fox-frames {
      0%, 6.24% { background-position: 0% 0%; }
      6.25%, 12.49% { background-position: 33.333% 0%; }
      12.5%, 18.74% { background-position: 66.667% 0%; }
      18.75%, 24.99% { background-position: 100% 0%; }
      25%, 31.24% { background-position: 0% 33.333%; }
      31.25%, 37.49% { background-position: 33.333% 33.333%; }
      37.5%, 43.74% { background-position: 66.667% 33.333%; }
      43.75%, 49.99% { background-position: 100% 33.333%; }
      50%, 56.24% { background-position: 0% 66.667%; }
      56.25%, 62.49% { background-position: 33.333% 66.667%; }
      62.5%, 68.74% { background-position: 66.667% 66.667%; }
      68.75%, 74.99% { background-position: 100% 66.667%; }
      75%, 81.24% { background-position: 0% 100%; }
      81.25%, 87.49% { background-position: 33.333% 100%; }
      87.5%, 93.74% { background-position: 66.667% 100%; }
      93.75%, 100% { background-position: 100% 100%; }
    }
    @media (prefers-reduced-motion: reduce) {
      #fox-slime-left-to-right.is-playing .sf-traveler,
      #fox-slime-left-to-right.is-playing .sf-sprite { animation: none; }
    }
  </style>

  <div class="sf-stage" role="img" aria-label="Zorro-slime pictórico saltando de izquierda a derecha mediante dieciséis poses">
    <div class="sf-traveler"><div class="sf-sprite"></div></div>
  </div>
  <div class="viz-controls sf-controls">
    <button id="fox-travel-replay" class="btn btn-primary" type="button"><i data-lucide="rotate-ccw" aria-hidden="true"></i> Repetir salto</button>
  </div>
  <span id="fox-travel-status" class="sr-only" aria-live="polite">Animación en reproducción</span>

  <script>
    (() => {
      const root = document.getElementById('fox-slime-left-to-right');
      const replay = document.getElementById('fox-travel-replay');
      const traveler = root && root.querySelector('.sf-traveler');
      const status = document.getElementById('fox-travel-status');
      if (!root || !replay || !traveler || !status) return;
      const play = () => {
        root.classList.remove('is-playing');
        void root.offsetWidth;
        root.classList.add('is-playing');
        status.textContent = 'Animación en reproducción';
      };
      replay.addEventListener('click', play);
      traveler.addEventListener('animationend', () => {
        status.textContent = 'Animación completada';
      });
    })();
  </script>
</section>`;

await writeFile(output, fragment, 'utf8');
console.log(output);
