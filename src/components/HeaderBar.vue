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
    <nav class="right">
      <button :class="['icon-btn', { active: isHomeActive }]" @click="goHome" title="Home">
        <div class="icon-wrap">
          <Icon icon="tabler:home" width="30" height="30" />
        </div>
        <span class="label">Home</span>
      </button>

      <button :class="['icon-btn', 'profile-btn', { active: isUserActive }]" @click="goUser" title="Perfil">
        <div class="icon-wrap">
          <img v-if="userAvatar" :src="userAvatar" alt="Perfil" class="profile-avatar" />
          <Icon v-else icon="tabler:user" width="30" height="30" />
        </div>
        <span class="label">Você</span>
      </button>

      <button :class="['icon-btn', { active: isMRActive }]" @click="goAnalysis" title="AI Analysis">
        <div class="icon-wrap">
          <Icon icon="tabler:sparkles" width="30" height="30" />
        </div>
        <span class="label">IA</span>
      </button>

      <button class="icon-btn" @click="onToggleTheme" :title="theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'">
        <div class="icon-wrap">
          <Icon :icon="theme === 'dark' ? 'tabler:moon' : 'tabler:sun'" width="30" height="30" />
        </div>
        <span class="label">Tema</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { supabase } from "../services/supabase";
import { useAuth } from "../composables";

const q = ref("");
const router = useRouter();
const route = useRoute();
const { user } = useAuth();

const userName = ref("Visitante");
const theme = ref("dark");
const userAvatar = ref(null);

// Carregar avatar do Supabase
async function loadAvatarFromDatabase() {
  if (!user.value) return;
  
  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.value.id)
      .single();

    if (profileData && profileData.avatar_url) {
      userAvatar.value = profileData.avatar_url;
    } else {
      userAvatar.value = null;
    }
  } catch (err) {
    console.log("Erro ao carregar avatar:", err.message);
    userAvatar.value = null;
  }
}

// Carregar dados do localStorage (fallback)
function loadUserDataFromStorage() {
  const u = JSON.parse(localStorage.getItem("skin_user") || "null");
  if (u && u.name) {
    userName.value = u.name;
  }
}

function handleUserUpdate() {
  // Quando UserView atualiza o avatar, recarrega aqui
  loadAvatarFromDatabase();
  loadUserDataFromStorage();
}

// Watch para recarregar quando usuário muda
watch(user, () => {
  if (user.value) {
    loadUserDataFromStorage();
    loadAvatarFromDatabase();
  }
});

onMounted(() => {
  loadUserDataFromStorage();
  
  // Sincroniza com o sistema de tema do App.vue
  const t = localStorage.getItem("theme") || "dark";
  theme.value = t;
  document.documentElement.setAttribute("data-theme", t);
  
  // Carrega avatar do banco
  if (user.value) {
    loadAvatarFromDatabase();
  }
  
  // Escuta atualizações do usuário
  window.addEventListener("user-updated", handleUserUpdate);
  window.addEventListener("avatar-updated", handleUserUpdate);
  
  // Recarrega avatar a cada 5 segundos para sincronizar mudanças
  const avatarRefreshInterval = setInterval(() => {
    if (user.value) {
      loadAvatarFromDatabase();
    }
  }, 5000);
  
  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener("user-updated", handleUserUpdate);
    window.removeEventListener("avatar-updated", handleUserUpdate);
    clearInterval(avatarRefreshInterval);
  });
});

onBeforeUnmount(() => {
  // Será sobrescrito pelo cleanup dentro de onMounted
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
const isHomeActive = computed(() => route.path === "/home");
const isMRActive = computed(() => route.path === "/ai-analysis" || route.path === "/mr");
const isUserActive = computed(() => route.path === "/user");

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
  margin-left: 7vw;
  width: 20vw;
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* new styles for labels and active state */
.icon-btn {
  flex-direction: column;
  gap: 6px;
  padding: 6px 10px;
}
.icon-wrap {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
.label {
  font-size: 11px;
  color: var(--muted);
}
.icon-btn.active .icon-wrap {
  background: var(--accent-solid);
  box-shadow: 0 6px 18px rgba(85, 81, 81, 0.075);
}

/* Mobile: navbar fixed bottom and centered */
@media (max-width: 768px) {
  .header {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    padding: 8px 12px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    display: flex;
    justify-content: center;
  }
  .center { display: none; }
  .left { display: none; }
  .right { gap: 14px; }
  .icon-btn { padding: 6px; }
  .search input {
    width: 16vw;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 6px 8px;
    gap: 4px;
  }
  .icon-wrap { 
    width: 26px; 
    height: 26px; 
  }
  .icon-wrap svg {
    width: 22px !important;
    height: 22px !important;
  }
  .label { 
    font-size: 9px; 
    margin-top: 2px;
  }
  .search input {
    width: 12vw;
    padding: 6px 8px;
    font-size: 12px;
  }
  .profile-avatar {
    width: 26px;
    height: 26px;
  }
}
</style>
