<script setup>
// Versão melhorada: expõe props para permitir controle dinâmico das camadas,
// samples e velocidade. Mantém limpeza adequada de listeners e otimizações básicas.
import { ref, onMounted, onBeforeUnmount, toRefs } from "vue";

// Props expostas para controlar o visual do fundo
const props = defineProps({
  // Array de camadas. Cada objeto pode conter: amp, freq, speed, alpha, lw, colors (array de 2 stops)
  layers: {
    type: Array,
    default: () => [
      { amp: 100, freq: 0.0028, speed: 0.35, alpha: 0.18, lw: 60 },
      { amp: 200, freq: 0.0016, speed: 0.2, alpha: 0.12, lw: 60 },
      { amp: 400, freq: 0.0009, speed: 0.12, alpha: 0.28, lw: 60 },
    ],
  },
  // Determina quantos pixels por amostra (width / samplesDivisor)
  samplesDivisor: { type: Number, default: 80 },
  // Multiplicador global de velocidade (para acelerar / desacelerar todas as camadas)
  speedMultiplier: { type: Number, default: 1 },
  // Composição global do canvas (ex: 'lighter' para aditivo)
  composite: { type: String, default: "lighter" },
});

// refs e variáveis internas
const { layers, samplesDivisor, speedMultiplier, composite } = toRefs(props);
const canvas = ref(null);
let ctx = null;
let raf = null;

// --- Helpers de ruído (value-noise 1D) ---
function hash(n) {
  return fract(Math.sin(n) * 43758.5453123);
}
function fract(x) {
  return x - Math.floor(x);
}
function smoothstep(a, b, t) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function valueNoise1D(x) {
  const i = Math.floor(x);
  const f = fract(x);
  const a = hash(i);
  const b = hash(i + 1);
  const t = smoothstep(0, 1, f);
  return a * (1 - t) + b * t;
}

// Redimensiona o canvas considerando devicePixelRatio para nitidez em HiDPI
function resizeCanvas(el) {
  if (!el) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;
  el.width = Math.floor(w * dpr);
  el.height = Math.floor(h * dpr);
  el.style.width = w + "px";
  el.style.height = h + "px";
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// Desenha todas as camadas - lê props dinamicamente a cada frame
function drawWaves(el) {
  if (!el || !ctx) return;
  const width = el.clientWidth;
  const height = el.clientHeight;
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = composite.value || "lighter";

  const time = performance.now() * 0.0004;
  
  // Configurações para animação suave da largura da linha
  const lwAnimationSpeed = 0.3; // Velocidade da pulsação
  const lwMin = 60;
  const lwMax = 120;

  // Percorre cada camada definida nas props
  layers.value.forEach((layer, idx) => {
    ctx.save();
    ctx.beginPath();

    const pts = [];
    const samples = Math.max(6, Math.floor(width / samplesDivisor.value));
    for (let i = 0; i <= samples; i++) {
      const x = (i / samples) * width;
      // Combina índice, frequência, tempo, velocidade e multiplicador global
      const n = valueNoise1D(
        i * layer.freq * 60 +
          idx * 47 +
          time * layer.speed * 1 * speedMultiplier.value
      );
      const y = height * 0.5 + (n - 0.5) * (layer.amp || 60);
      pts.push({ x, y });
    }
    // Linha suave com pontos de controle (quadraticCurveTo)
    if (pts.length) ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const cx = (prev.x + cur.x) / 2;
      const cy = (prev.y + cur.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
    }
    
    if (pts.length > 0) {
      ctx.lineTo(width, pts[pts.length - 1].y);
    }

    // Gradient colors: aceita overrides por layer.colors = ['rgba(...)','rgba(...)']
    const grad = ctx.createLinearGradient(
      0,
      height * 0.25,
      width,
      height * 0.75
    );
    if (layer.colors && layer.colors.length >= 2) {
      grad.addColorStop(
        0,
        layer.colors[0].replace(/ALPHA/g, String(layer.alpha || 0.12))
      );
      grad.addColorStop(
        1,
        layer.colors[1].replace(/ALPHA/g, String(layer.alpha || 0.12))
      );
    } else if (idx === 2) {
      grad.addColorStop(0, "rgba(138,43,255," + (layer.alpha || 0.08) + ")");
      grad.addColorStop(1, "rgba(0,243,255," + (layer.alpha || 0.08) + ")");
    } else {
      grad.addColorStop(0, "rgba(0,229,255," + (layer.alpha || 0.12) + ")");
      grad.addColorStop(
        1,
        "rgba(111,214,255," + (layer.alpha || 0.12) * 0.9 + ")"
      );
    }

    ctx.strokeStyle = grad;
    
    // Animação suave da largura entre 60 e 120
    // Usa seno para criar uma oscilação contínua e suave
    // Adiciona offset por camada (idx) para que cada camada pulse em momentos diferentes
    const lwOscillation = Math.sin(time * lwAnimationSpeed + idx * 1.5) * 0.5 + 0.5; // 0 a 1
    const lwAnimated = lwMin + lwOscillation * (lwMax - lwMin); // 60 a 120
    
    ctx.lineWidth = lwAnimated;
    ctx.lineCap = "square";

    // Opcional: sombra por camada para aumentar o efeito neon
    if (layer.shadow) {
      ctx.shadowBlur = layer.shadow.blur || 12;
      ctx.shadowColor = layer.shadow.color || "rgba(0,243,255,0.6)";
    }

    ctx.stroke();
    ctx.restore();
  });
}

// --- Ciclo de vida ---
onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  ctx = el.getContext("2d");
  resizeCanvas(el);

  // Resize listener otimizado via RAF
  let resizeScheduled = false;
  const onResize = () => {
    if (resizeScheduled) return;
    resizeScheduled = true;
    requestAnimationFrame(() => {
      resizeScheduled = false;
      resizeCanvas(el);
    });
  };
  window.addEventListener("resize", onResize);

  const loop = () => {
    drawWaves(el);
    raf = requestAnimationFrame(loop);
  };
  loop();

  // Salva referências para limpeza
  el.__dw_onResize = onResize;
});

onBeforeUnmount(() => {
  const el = canvas.value;
  if (el && el.__dw_onResize)
    window.removeEventListener("resize", el.__dw_onResize);
  if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
  <canvas ref="canvas" class="dynamic-waves" />
</template>

<style scoped lang="scss">
.dynamic-waves {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
