<!--
  Arquivo: src/routes/HomeView.vue
  Descrição: Dashboard inicial estilo XMB — hero com ações rápidas e cards informativos.
  - Template: seção `hero` com botões para Diagnóstico e Produtos; cards flutuantes para destaque.
  - Script: carrega `anime.js` dinamicamente para animações suaves dos cards (fallback simples se falhar).

  Como modificar:
  - Para alterar animação, edite `loadAnimeFromCDN` ou substitua por animação local.
  - Para mudar o visual dos cards, atualize as classes `.card` e variáveis em `main.scss`.
-->

<template>
  <div class="home-root container">
    <section class="hero glass center">
      <div class="hero-inner">
        <h1>Navegue pelo SkinSense AI</h1>
        <p>Selecione suas opções</p>
        <div class="hero-actions">
          <button class="btn" @click="goAnalysis">⭐ Diagnóstico</button>
          <button class="btn ghost" @click="focusSearch">🔎 Produtos</button>
        </div>
      </div>
    </section>

    <section class="cards">
      <div
        class="card glass"
        ref="card1"
        :class="useFallback ? 'float-fallback delay-0' : ''"
      >
        <h3>Análise</h3>
        <p>Recomendações personalizadas para sua pele.</p>
      </div>
      <div
        class="card glass"
        ref="card2"
        :class="useFallback ? 'float-fallback delay-1' : ''"
      >
        <h3>Sustentabilidade</h3>
        <p>Produtos pensados para o planeta.</p>
      </div>
      <div
        class="card glass"
        ref="card3"
        :class="useFallback ? 'float-fallback delay-2' : ''"
      >
        <h3>Tecnologia</h3>
        <p>Modelos avançados e privacidade.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const card1 = ref(null);
const card2 = ref(null);
const card3 = ref(null);
const useFallback = ref(false);

function goAnalysis() {
  router.push("/ai-analysis");
}
function focusSearch() {
  router.push("/search");
}

function loadAnimeFromCDN() {
  return new Promise((resolve, reject) => {
    if (window.anime) return resolve(window.anime);
    const src = "https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.anime));
      existing.addEventListener("error", () =>
        reject(new Error("anime load error"))
      );
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.anime);
    s.onerror = () => reject(new Error("Failed to load anime.js from CDN"));
    document.head.appendChild(s);
  });
}

onMounted(async () => {
  try {
    const anime = await loadAnimeFromCDN();
    anime({
      targets: [card1.value, card2.value, card3.value],
      translateY: [0, -10, 0],
      duration: 3000,
      delay: anime.stagger(200),
      loop: true,
      easing: "easeInOutSine",
    });
  } catch (err) {
    useFallback.value = true;
  }
});
</script>

<style scoped>
.hero {
  padding: 36px;
  margin: 20px 0;
}
.hero-inner {
  text-align: center;
}
.hero-inner h1 {
  font-size: 28px;
  margin-bottom: 6px;
}
.hero-inner p {
  margin-bottom: 16px;
  color: var(--muted);
}
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cards {
  display: flex;
  gap: 18px;
  margin-top: 28px;
  justify-content: center;
}
.card {
  width: 260px;
  padding: 18px;
  border-radius: 14px;
}
.card h3 {
  margin: 0 0 6px;
}

@keyframes floaty {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
.float-fallback {
  animation: floaty 3000ms ease-in-out infinite;
}
.delay-0 {
  animation-delay: 0s;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}

.card p {
  margin: 0;
  color: var(--muted);
}
</style>
