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
      <button v-if="!isHome" class="back-btn-header" @click="goBack" title="Voltar">
        <Icon icon="tabler:arrow-left" width="18" height="18" />
        Voltar
      </button>
      <div v-else class="brand">
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
      <button class="icon-btn" @click="goHome" title="Home">
        <Icon icon="tabler:home" width="30" height="30" />
      </button>
      <button class="icon-btn profile-btn" @click="goUser" title="Perfil">
        <img v-if="userAvatar" :src="userAvatar" alt="Perfil" class="profile-avatar" />
        <Icon v-else icon="tabler:user" width="30" height="30" />
      </button>
      <button class="icon-btn" @click="goAnalysis" title="AI Analysis">
        <Icon icon="tabler:sparkles" width="30" height="30" />
      </button>
      <button
        class="icon-btn"
        @click="onToggleTheme"
        :title="theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'"
      >
        <Icon :icon="theme === 'dark' ? 'tabler:moon' : 'tabler:sun'" width="30" height="30" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

const q = ref("");
const router = useRouter();
const route = useRoute();

const userName = ref("Visitante");
const theme = ref("dark");
const userAvatar = ref(null);

function loadUserData() {
  const u = JSON.parse(localStorage.getItem("skin_user") || "null");
  if (u) {
    if (u.name) userName.value = u.name;
    if (u.avatar) userAvatar.value = u.avatar;
    else userAvatar.value = null;
  }
}

function handleUserUpdate() {
  loadUserData();
}

onMounted(() => {
  loadUserData();
  // Sincroniza com o sistema de tema do App.vue
  const t = localStorage.getItem("theme") || "dark";
  theme.value = t;
  // Garante que o tema está aplicado (App.vue também faz isso, mas garantimos aqui)
  document.documentElement.setAttribute("data-theme", t);
  // Escuta atualizações do usuário
  window.addEventListener("user-updated", handleUserUpdate);
});

onBeforeUnmount(() => {
  window.removeEventListener("user-updated", handleUserUpdate);
});

function onToggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
  // Usa o mesmo sistema do App.vue
  document.documentElement.setAttribute("data-theme", theme.value);
  // Dispara evento customizado para sincronizar com App.vue
  window.dispatchEvent(new CustomEvent("theme-changed"));
}


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

const isHome = computed(() => route.path === "/home");

function goBack() {
  router.back();
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
.back-btn-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  backdrop-filter: blur(8px);
}
.back-btn-header:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--accent-solid);
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
  color: var(--text);
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}
.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}
.profile-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
</style>
