<!--
  Arquivo: src/components/HeaderBar.vue
  Descrição: Barra superior fixa com busca, navegação rápida (Home, Perfil, AI) e alternância de tema.
  - Template: marca o nome do usuário, campo de busca e botões de navegação.
  - Script: gerencia nome do usuário, tema e navegação via `router`.

  Como modificar:
  - Altere ícones/textos dos botões no template para ajustar UX.
  - Para trocar o comportamento de tema, edite `applyTheme` e `onToggleTheme`.
-->

<template>
  <header class="header glass">
    <div class="left">
      <div class="brand">
        Bem vindo, <strong>{{ userName }}</strong>
      </div>
    </div>
    <div class="center">
      <div class="search">
        <input
          v-model="q"
          @keyup.enter="onSearch"
          placeholder="Pesquisar produtos..."
          aria-label="Pesquisar"
        />
      </div>
    </div>
    <div class="right">
      <button class="icon-btn" @click="goHome" title="Home">🏠</button>
      <button class="icon-btn" @click="goUser" title="Perfil">👤</button>
      <button class="icon-btn" @click="goAnalysis" title="AI Analysis">
        ⭐
      </button>
      <button
        class="icon-btn"
        @click="onToggleTheme"
        :title="theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'"
      >
        {{ themeIcon }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const q = ref("");
const router = useRouter();

const userName = ref("Visitante");
const theme = ref("dark");

onMounted(() => {
  const u = JSON.parse(localStorage.getItem("skin_user") || "null");
  if (u && u.name) userName.value = u.name;
  // Sincroniza com o sistema de tema do App.vue
  const t = localStorage.getItem("theme") || "dark";
  theme.value = t;
  // Garante que o tema está aplicado (App.vue também faz isso, mas garantimos aqui)
  document.documentElement.setAttribute("data-theme", t);
});

function onToggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
  // Usa o mesmo sistema do App.vue
  document.documentElement.setAttribute("data-theme", theme.value);
  // Dispara evento customizado para sincronizar com App.vue
  window.dispatchEvent(new CustomEvent("theme-changed"));
}

const themeIcon = computed(() => (theme.value === "dark" ? "🌙" : "☀️"));

function onSearch() {
  if (!q.value) return;
  router.push({ path: "/search", query: { q: q.value } });
}
function goHome() {
  router.push("/home");
}
function goUser() {
  router.push("/user");
}
function goAnalysis() {
  router.push("/ai-analysis");
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 12px;
  left: 12px;
  right: 12px;
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  z-index: 40;
}
.left .brand {
  font-size: 14px;
  color: var(--muted);
}
.center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.search input {
  width: 320px;
  max-width: 50vw;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.icon-btn {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
