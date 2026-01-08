<!--
  Arquivo: src/routes/UserView.vue
  Descrição: Tela de perfil do usuário estilo console (full-viewport).
  - Layout: painel central dividido em duas colunas (perfil à esquerda, conteúdo à direita).
  - Interações: itens do histórico abrem modal; o layout imita navegação de console sem scroll tradicional.

  Como modificar:
  - Para ajustar a proporção das colunas, edite as regras CSS de `.left` e `.right`.
  - Para permitir rolagem vertical em telas pequenas, adapte `.user-root` e `.user-panel`.
-->

<template>
  <div class="user-root center">
    <button class="back-btn" @click="goBack" title="Voltar">
      <Icon icon="tabler:arrow-left" width="16" height="16" />
      Voltar
    </button>
    <div class="user-panel glass">
        <div class="avatar-container">
          <div class="avatar" :style="avatarStyle">
            <span v-if="!user.avatar">{{ initials }}</span>
          </div>
          <label class="avatar-upload-btn">
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              style="display: none"
            />
            <Icon icon="tabler:camera" width="16" height="16" />
            Alterar foto
          </label>
        <h2>{{ user.name }}</h2>
      </div>
      <div>
        <ul class="history">
          <h3>Histórico de Beleza</h3>
          <li
            v-for="item in history"
            :key="item.id"
            @click="open(item)"
            class="history-item"
          >
            <div class="title">{{ item.name }}</div>
            <div class="meta">{{ item.meta }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="selected" class="modal-overlay" @click.self="selected = null">
      <div class="modal glass">
        <button class="close" @click="selected = null">Fechar</button>
        <h3>{{ selected.name }}</h3>
        <p>{{ selected.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";

const router = useRouter();

const user = ref({ name: "Visitante" });
onMounted(() => {
  const u = JSON.parse(localStorage.getItem("skin_user") || "null");
  // ensure we load profile from profiles map to support multi-user profiles
  if (u && u.email) {
    const profilesRaw = localStorage.getItem("skin_profiles") || "{}";
    const profiles = JSON.parse(profilesRaw);
    const p = profiles[u.email] || u;
    user.value = p;
    // keep skin_user synchronized
    localStorage.setItem("skin_user", JSON.stringify(p));
  } else if (u) {
    user.value = u;
  }
});

const initials = computed(() =>
  user.value.name
    ? user.value.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VS"
);

const avatarStyle = computed(() => {
  if (user.value.avatar) {
    return {
      backgroundImage: `url(${user.value.avatar})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
});

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Valida tamanho (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 2MB");
    return;
  }

  const reader = new FileReader();
    reader.onload = (e) => {
      const avatarData = e.target.result;
      user.value.avatar = avatarData;
      // Salva no map de perfis por email
      const profilesRaw = localStorage.getItem("skin_profiles") || "{}";
      const profiles = JSON.parse(profilesRaw);
      if (user.value.email) profiles[user.value.email] = user.value;
      localStorage.setItem("skin_profiles", JSON.stringify(profiles));
      // Atualiza usuário atual
      localStorage.setItem("skin_user", JSON.stringify(user.value));
      // Dispara evento para atualizar HeaderBar
      window.dispatchEvent(new CustomEvent("user-updated"));
    };
  reader.readAsDataURL(file);
}

function goBack() {
  router.back();
}

const history = ref([
  {
    id: 1,
    name: "Vichy Mineral 89",
    meta: "Usado: 2025-10-12",
    description: "Hidratante leve para rotina matinal.",
  },
  {
    id: 2,
    name: "La Roche-Posay Effaclar",
    meta: "Usado: 2025-08-01",
    description: "Sérum para pele oleosa.",
  },
]);

const selected = ref(null);
function open(i) {
  selected.value = i;
}
</script>

<style scoped>
.user-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 16px;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  backdrop-filter: blur(8px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.back-btn:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--accent-solid);
}
.user-panel {
  width: 90vw;
  height: 70vh;
  display: flex;
  align-self: center;
  justify-self: center;
  align-items: center;
  justify-content: center;
  text-align: left;
  gap: 24px;
  padding: 24px;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-right: 25vw;
}
.avatar {
  width: 240px;
  height: 240px;
  border-radius: 20px;
  background: var(--accent-solid);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  border: 3px solid var(--glass-border);
  overflow: hidden;
}
.avatar-upload-btn {
  padding: 8px 16px;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease, transform 0.2s ease;
  backdrop-filter: blur(8px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.avatar-upload-btn:hover {
  background: var(--accent-solid);
  transform: translateY(-2px);
}
.status {
  color: var(--muted);
  margin-top: 8px;
}
.right {
  flex: 1;
}
.history {
  text-align: center;
  list-style: none;
  padding: 0;
  margin-left: 4rem;
}
.history-item {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
}
.history-item:hover {
  transform: translateY(-4px);
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}
.modal {
  width: 640px;
  max-width: 94%;
  padding: 18px;
  position: relative;
}
.close {
  position: absolute;
  right: 12px;
  top: 12px;
}
</style>
