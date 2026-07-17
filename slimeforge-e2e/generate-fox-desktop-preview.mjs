import { readFile, writeFile } from 'node:fs/promises';

const asset = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/fox-slime-16-frames.webp';
const output = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/fox-slime-desktop.html';
const data = (await readFile(asset)).toString('base64');

const fragment = `<section id="fox-slime-desktop" class="is-playing">
  <style>
    #fox-slime-desktop { display: grid; gap: 12px; color: var(--foreground); }
    #fox-slime-desktop .sf-desktop {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      min-height: 260px;
      overflow: hidden;
      border-radius: 16px;
      background:
        radial-gradient(circle at 72% 22%, color-mix(in srgb, var(--viz-series-5) 22%, transparent) 0 8%, transparent 23%),
        radial-gradient(ellipse at 54% 72%, color-mix(in srgb, var(--viz-series-3) 20%, transparent), transparent 55%),
        linear-gradient(145deg, color-mix(in srgb, var(--viz-series-3) 24%, var(--background)), var(--background) 72%);
    }
    #fox-slime-desktop .sf-icons {
      position: absolute;
      top: 7%;
      left: 3%;
      display: grid;
      gap: 14px;
      color: var(--card-foreground);
    }
    #fox-slime-desktop .sf-icon {
      display: grid;
      justify-items: center;
      gap: 3px;
      opacity: .72;
    }
    #fox-slime-desktop .sf-icon span { color: var(--card-foreground); }
    #fox-slime-desktop .sf-window {
      position: absolute;
      padding: 12px;
      display: grid;
      gap: 9px;
      opacity: .88;
    }
    #fox-slime-desktop .sf-window-main { left: 20%; top: 12%; width: 48%; height: 48%; }
    #fox-slime-desktop .sf-window-side { right: 4%; top: 20%; width: 23%; height: 34%; }
    #fox-slime-desktop .sf-window-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    #fox-slime-desktop .sf-dots { display: flex; gap: 5px; }
    #fox-slime-desktop .sf-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted-foreground); opacity: .45; }
    #fox-slime-desktop .sf-line { height: 7px; border-radius: 999px; background: var(--muted); }
    #fox-slime-desktop .sf-line.short { width: 62%; }
    #fox-slime-desktop .sf-focus-time { align-self: center; justify-self: center; color: var(--card-foreground); font-weight: 500; }
    #fox-slime-desktop .sf-taskbar {
      position: absolute;
      z-index: 5;
      inset: auto 0 0;
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      background: color-mix(in srgb, var(--card) 88%, transparent);
      border-top: 1px solid var(--border);
      color: var(--card-foreground);
    }
    #fox-slime-desktop .sf-traveler {
      position: absolute;
      z-index: 4;
      left: 0;
      bottom: 5%;
      width: 32%;
      aspect-ratio: 404.75 / 242.75;
      transform: translateX(0);
    }
    #fox-slime-desktop.is-playing .sf-traveler { animation: sf-desktop-travel 2.15s linear forwards; }
    #fox-slime-desktop .sf-sprite {
      width: 100%;
      height: 100%;
      background-image: url("data:image/webp;base64,${data}");
      background-repeat: no-repeat;
      background-size: 400% 400%;
      background-position: 0% 0%;
      -webkit-mask-image: radial-gradient(ellipse 68% 68% at 50% 53%, #000 54%, transparent 98%);
      mask-image: radial-gradient(ellipse 68% 68% at 50% 53%, #000 54%, transparent 98%);
    }
    #fox-slime-desktop.is-playing .sf-sprite { animation: sf-desktop-frames 2.15s step-end forwards; }
    #fox-slime-desktop .sf-controls { justify-content: center; }
    @keyframes sf-desktop-travel {
      from { transform: translateX(0); }
      to { transform: translateX(212.5%); }
    }
    @keyframes sf-desktop-frames {
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
    @media (max-width: 480px) {
      #fox-slime-desktop .sf-window-main { left: 18%; width: 58%; }
      #fox-slime-desktop .sf-window-side { display: none; }
      #fox-slime-desktop .sf-icon span { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      #fox-slime-desktop.is-playing .sf-traveler,
      #fox-slime-desktop.is-playing .sf-sprite { animation: none; }
    }
  </style>

  <div class="sf-desktop" role="img" aria-label="Escritorio ficticio con ventanas, barra inferior y un zorro-slime saltando por delante">
    <div class="sf-icons" aria-hidden="true">
      <div class="sf-icon"><i data-lucide="folder"></i><span class="text-small">Proyectos</span></div>
      <div class="sf-icon"><i data-lucide="image"></i><span class="text-small">Recuerdos</span></div>
      <div class="sf-icon"><i data-lucide="trash-2"></i><span class="text-small">Papelera</span></div>
    </div>
    <section class="card sf-window sf-window-main" aria-hidden="true">
      <div class="sf-window-head"><span>Plan de hoy</span><span class="sf-dots"><i class="sf-dot"></i><i class="sf-dot"></i><i class="sf-dot"></i></span></div>
      <div class="sf-line"></div><div class="sf-line short"></div><div class="sf-line"></div><div class="sf-line short"></div>
    </section>
    <section class="card sf-window sf-window-side" aria-hidden="true">
      <div class="sf-window-head"><span>Foco</span><i data-lucide="flame"></i></div>
      <div class="sf-focus-time">25:00</div>
      <div class="sf-line"></div>
    </section>
    <div class="sf-traveler"><div class="sf-sprite"></div></div>
    <div class="sf-taskbar" aria-hidden="true"><i data-lucide="search"></i><i data-lucide="globe-2"></i><i data-lucide="music"></i><i data-lucide="message-circle"></i></div>
  </div>
  <div class="viz-controls sf-controls">
    <button id="fox-desktop-replay" class="btn btn-primary" type="button"><i data-lucide="rotate-ccw" aria-hidden="true"></i> Repetir paseo</button>
  </div>
  <span id="fox-desktop-status" class="sr-only" aria-live="polite">Animación en reproducción</span>

  <script>
    (() => {
      const root = document.getElementById('fox-slime-desktop');
      const replay = document.getElementById('fox-desktop-replay');
      const traveler = root && root.querySelector('.sf-traveler');
      const status = document.getElementById('fox-desktop-status');
      if (!root || !replay || !traveler || !status) return;
      const play = () => {
        root.classList.remove('is-playing');
        void root.offsetWidth;
        root.classList.add('is-playing');
        status.textContent = 'Animación en reproducción';
      };
      replay.addEventListener('click', play);
      traveler.addEventListener('animationend', () => { status.textContent = 'Animación completada'; });
    })();
  </script>
</section>`;

await writeFile(output, fragment, 'utf8');
console.log(output);
