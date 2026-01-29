<template>
  <div class="page-wrapper">
    
    <button class="back-btn" @click="goBack" title="Voltar">
      <Icon icon="tabler:arrow-left" width="16" height="16" />
      Voltar
    </button>

    <div class="user-container">
      <div class="dashboard-card glass">
        <aside class="sidebar">
          <div class="user-quick-info">
            <div class="avatar-small" :style="avatarStyle">
              <span v-if="!profile.avatar_url">{{ initials }}</span>
            </div>

            <p class="welcome-text">Olá, {{ firstName }}</p>
          </div>

          <nav class="nav-menu">
            <button
              :class="['nav-btn', { active: activeTab === 'overview' }]"
              @click="activeTab = 'overview'"
            >
              <Icon icon="lucide:layout-dashboard" /> Visão Geral
            </button>

            <button
              :class="['nav-btn', { active: activeTab === 'profile' }]"
              @click="activeTab = 'profile'"
            >
              <Icon icon="lucide:user-cog" /> Editar Perfil
            </button>

            <button
              :class="['nav-btn', { active: activeTab === 'security' }]"
              @click="activeTab = 'security'"
            >
              <Icon icon="lucide:shield-check" /> Segurança
            </button>

            <button
              :class="['nav-btn', { active: activeTab === 'themes' }]"
              @click="activeTab = 'themes'"
            >
              <Icon icon="lucide:palette" /> Estilos
            </button>
          </nav>

          <button class="logout-btn" @click="openLogoutModal">
            <Icon icon="lucide:log-out" /> Sair
          </button>
        </aside>

        <main class="content-area">
          <Transition name="fade" mode="out-in">
            <div
              v-if="activeTab === 'overview'"
              key="overview"
              class="tab-content"
            >
              <header class="tab-header">
                <h2>Seu Painel</h2>
                <p>
                  Seu AURA, seu estilo. Gerencie seu perfil navegando pelos menus.
                </p>
              </header>

              <div class="avatar-upload-section">
                <div class="avatar-large" :style="avatarStyle">
                  <span v-if="!profile.avatar_url">{{ initials }}</span>

                  <label for="file-input" class="edit-overlay">
                    <Icon icon="lucide:camera" />
                  </label>

                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    hidden
                  />
                </div>

                <p class="hint">
                  Clique na foto para alterar (Tamanho máximo de arquivo: 2MB)
                </p>
              </div>

              <div class="history-section">
                <h3><Icon icon="lucide:history" /> Histórico de Busca</h3>

                <ul v-if="searchHistory.length" class="history-list">
                  <li v-for="item in searchHistory" :key="item.id">
                    <span>{{ item.query }}</span>
                    <small>{{
                      new Date(item.searched_at).toLocaleDateString()
                    }}</small>
                  </li>
                </ul>

                <p v-else class="empty-msg">Nenhuma busca recente.</p>
              </div>
            </div>

            <div
              v-else-if="activeTab === 'profile'"
              key="profile"
              class="tab-content"
            >
              <header class="tab-header">
                <h2>Dados Pessoais</h2>
                <p>Como você aparece para a comunidade.</p>
              </header>

              <form @submit.prevent="updateName" class="settings-form">
                <div class="form-group">
                  <label>Digite aqui caso queira alterar seu nome.</label>
                  <input
                    v-model="profile.full_name"
                    type="text"
                    placeholder="Digite seu novo nome"
                  />
                </div>

                <button type="submit" class="btn-ghost" :disabled="loading">
                  {{ loading ? "Salvando..." : "Salvar Alterações" }}
                </button>
              </form>
            </div>

            <div
              v-else-if="activeTab === 'security'"
              key="security"
              class="tab-content"
            >
              <header class="tab-header">
                <h2>Segurança</h2>
                <p>Atualize suas credenciais de acesso.</p>
              </header>

              <div class="settings-form">
                <div class="form-group">
                  <label>Novo E-mail</label>
                  <input
                    v-model="security.email"
                    type="email"
                    placeholder="novo@email.com"
                  />
                  <button
                    @click="updateEmail"
                    class="btn-ghost"
                    :disabled="loading"
                  >
                    Atualizar Email
                  </button>
                </div>

                <div class="divider"></div>

                <div class="form-group">
                  <label>Nova Senha</label>
                  <!-- Componente reutilizável de input de senha com validação -->
                  <PasswordInput
                    v-model="security.password"
                    show-validation
                    placeholder="Mínimo 8 caracteres, 1 número, 1 caractere especial"
                    @validation-change="passwordValidation.isValid = $event"
                  />
                  
                  <button
                    @click="updatePassword"
                    class="btn-ghost"
                    :disabled="loading || !passwordValidation.isValid"
                  >
                    Atualizar Senha
                  </button>
                </div>
              </div>
            </div>

            <div
              v-else-if="activeTab === 'themes'"
              key="themes"
              class="tab-content"
            >
              <header class="tab-header">
                <h2>Estilos e Temas</h2>
                <p>Personalize a aparência do AURA.</p>
              </header>

              <div class="theme-section">
                <h3>Escolha sua Paleta de Cores</h3>
                <p>Cada um tem uma identidade única. Escolha sua cor favorita.</p>

                <div class="theme-grid">
                  <button
                    v-for="t in availableColors"
                    :key="t.id"
                    :class="['theme-btn', { active: currentColor === t.id }]"
                    @click="changeColor(t.id)"
                    :style="{ '--color': t.preview }"
                    :title="t.label"
                  >
                    <span class="theme-name">{{ t.label }}</span>
                    <Icon
                      v-if="currentColor === t.id"
                      icon="lucide:check"
                      width="20"
                      height="20"
                    />
                  </button>
                </div>
              </div>

              <div class="theme-section">
                <h3>Escolha o Modo</h3>
                <p>Selecione entre modo escuro ou claro.</p>

                <div class="theme-grid">
                  <button
                    v-for="thm in availableThemes"
                    :key="thm.id"
                    :class="['theme-btn', { active: currentTheme === thm.id }]"
                    @click="changeTheme(thm.id)"
                    :title="thm.label"
                  >
                    <Icon :icon="thm.icon" width="24" height="24" />
                    <span class="theme-name">{{ thm.label }}</span>
                    <Icon
                      v-if="currentTheme === thm.id"
                      icon="lucide:check"
                      width="20"
                      height="20"
                    />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </main>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="showLogoutModal"
        class="modal-overlay"
        @click="closeLogoutModal"
      >
        <div class="modal glass" @click.stop>
          <h3>Confirmar Saída</h3>
          <p>
            Você tem certeza que deseja sair? Será necessário fazer login
            novamente para acessar seus conteúdos no AURA.
          </p>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeLogoutModal">
              Cancelar
            </button>
            <button class="btn-danger" @click="confirmLogout">
              Sair agora
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import PasswordInput from "../components/PasswordInput.vue";
import { useAuth } from "../composables/useAuth";
import { supabase } from "../services/supabase";
import { toast } from "vue-sonner";

const router = useRouter();
const { user, signOut, userName } = useAuth();

// Estados
const activeTab = ref("overview");
const loading = ref(false);
const searchHistory = ref([]);
const showLogoutModal = ref(false);
const currentColor = ref(localStorage.getItem("colorTheme") || "blue");
const currentTheme = ref(localStorage.getItem("theme") || "dark");

const availableColors = [
  { id: "blue", label: "Oceano", preview: "#2ea4ff" },
  { id: "red", label: "Verão", preview: "#ff4757" },
  { id: "green", label: "Arbóreo", preview: "#27ae60" },
  { id: "purple", label: "Púrpura", preview: "#9b59b6" },
  { id: "bw", label: "Preto e Branco", preview: "#333333" },
];

const availableThemes = [
  { id: "dark", label: "Escuro", icon: "tabler:moon" },
  { id: "light", label: "Claro", icon: "tabler:sun" },
];

const profile = ref({
  full_name: "",
  avatar_url: "",
});

const security = ref({
  email: "",
  password: "",
});

// Estado para validação de senha
const passwordValidation = ref({
  hasMinLength: false,
  hasNumber: false,
  hasSpecial: false,
  isValid: false,
});

const showPasswordFeedback = ref(false);

// --- COMPUTED ---
const firstName = computed(() => {
  const fullName =
    profile.value.full_name ||
    user.value?.user_metadata?.full_name ||
    userName.value ||
    "Visitante";
  return fullName.split(" ")[0];
});

const initials = computed(() => {
  const fullName =
    profile.value.full_name ||
    user.value?.user_metadata?.full_name ||
    userName.value ||
    "US";
  return fullName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
});

const avatarStyle = computed(() => {
  if (profile.value.avatar_url) {
    return {
      backgroundImage: `url(${profile.value.avatar_url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "var(--primary-color, #00e5ff)" };
});

// --- LÓGICA DE DADOS ---
const loadData = async () => {
  if (!user.value) return;
  loading.value = true;
  try {
    // 1. Carregar Perfil - Sempre do banco de dados
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (profileData) {
      // Perfil existe no banco
      profile.value = profileData;
    } else if (profileError?.code === 'PGRST116') {
      // Perfil não existe, cria novo
      const nameFromMetadata = user.value.user_metadata?.full_name || "Usuário";
      profile.value.full_name = nameFromMetadata;
      profile.value.avatar_url = "";
      
      try {
        await supabase.from("profiles").insert({
          id: user.value.id,
          full_name: nameFromMetadata,
          avatar_url: "",
          created_at: new Date(),
        });
      } catch (insertErr) {
        console.log("Erro ao criar perfil:", insertErr.message);
      }
    } else {
      // Outro erro
      throw profileError;
    }

    // 2. Carregar Histórico de Buscas
    const { data: historyData } = await supabase
      .from("search_history")
      .select("*")
      .eq("user_id", user.value.id)
      .order("searched_at", { ascending: false })
      .limit(5);

    if (historyData) searchHistory.value = historyData;
  } catch (err) {
    console.error("Erro ao carregar dados:", err);
    // Fallback: usar metadata do Auth
    if (!profile.value.full_name) {
      profile.value.full_name =
        user.value.user_metadata?.full_name || "Usuário";
    }
    if (!profile.value.avatar_url) {
      profile.value.avatar_url = "";
    }
  } finally {
    loading.value = false;
  }
};

// --- AÇÕES ---
const updateName = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.from("profiles").upsert({
      id: user.value.id,
      full_name: profile.value.full_name,
      updated_at: new Date(),
    });

    if (error) throw error;
    toast.success ? toast.success("Nome atualizado!") : alert("Nome atualizado!");
    await supabase.auth.updateUser({
      data: { full_name: profile.value.full_name },
    });
    // Notificar HeaderBar para atualizar o nome
    window.dispatchEvent(new CustomEvent("user-updated"));
  } catch (err) {
    alert("Erro ao atualizar nome.");
  } finally {
    loading.value = false;
  }
};

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) return alert("Imagem muito grande (Max 2MB)");
  
  loading.value = true;
  try {
    const fileExt = file.name.split(".").pop();
    // Use apenas o ID do usuário para que seja sempre a mesma imagem
    const fileName = `${user.value.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload com upsert true para substituir se existir
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Obter URL pública (sempre a mesma para o mesmo usuário)
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Salvar no banco de dados (persist em qualquer dispositivo)
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date()
      })
      .eq("id", user.value.id);

    if (updateError) throw updateError;

    // Atualizar local
    profile.value.avatar_url = publicUrl;
    toast.success ? toast.success("Foto atualizada!") : alert("Foto atualizada!");
    
    // Notificar HeaderBar para atualizar avatar
    window.dispatchEvent(new CustomEvent("avatar-updated"));
  } catch (err) {
    console.error("Erro no upload:", err);
    alert("Erro no upload: " + err.message);
  } finally {
    loading.value = false;
  }
}

const updateEmail = async () => {
  if (!security.value.email) return;
  loading.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      email: security.value.email,
    });
    if (error) throw error;
    alert("Verifique seu novo e-mail para confirmar a troca.");
  } catch (err) {
    alert(err.message);
  } finally {
    loading.value = false;
  }
};

const updatePassword = async () => {
  if (!security.value.password) {
    toast.error("Por favor, insira uma nova senha");
    return;
  }
  
  if (!passwordValidation.value.isValid) {
    toast.error("Senha não atende aos requisitos mínimos");
    return;
  }
  
  loading.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      password: security.value.password,
    });
    if (error) throw error;
    toast.success("Senha alterada com sucesso!");
    security.value.password = "";
    passwordValidation.value.isValid = false;
  } catch (err) {
    toast.error(err.message || "Erro ao atualizar senha");
  } finally {
    loading.value = false;
  }
};

async function handleLogout() {
  try {
    // Fazer logout no Supabase
    await signOut();
    
    // Remover credenciais salvas do localStorage (limpar "lembrar de mim")
    localStorage.removeItem('skin_saved_credentials');
    
    // Limpar dados de perfil
    localStorage.removeItem('skin_user');
    
    // Redirecionar para login
    router.push("/login");
  } catch (err) {
    console.error('Erro ao fazer logout:', err);
    // Mesmo com erro, limpa localStorage e redireciona
    localStorage.removeItem('skin_saved_credentials');
    localStorage.removeItem('skin_user');
    router.push("/login");
  }
}

function openLogoutModal() { showLogoutModal.value = true; }
function closeLogoutModal() { showLogoutModal.value = false; }
async function confirmLogout() {
  closeLogoutModal();
  await handleLogout();
}

function changeColor(color) {
  currentColor.value = color;
  localStorage.setItem("colorTheme", color);
  document.documentElement.setAttribute("data-color", color);
  window.dispatchEvent(new CustomEvent("color-changed"));
}

function changeTheme(theme) {
  currentTheme.value = theme;
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(new CustomEvent("theme-changed"));
}

function goBack() { router.back(); }

onMounted(() => { loadData(); });
</script>

<style scoped lang="scss">
/* --- CORREÇÃO PRINCIPAL: ESTRUTURA E SCROLL --- */

/* Wrapper que ocupa toda a tela e impede scroll da janela */
.page-wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background: var(--bg-color); /* Certifique-se que existe cor de fundo */
}

/* Container centralizado via Flexbox (resolve o problema da transição pulando) */
.user-container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.back-btn {
  position: absolute;
  left: 32px;
  top: 32px;
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
  z-index: 10;
}

.back-btn:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--accent-solid);
}

.dashboard-card {
  display: grid;
  grid-template-columns: 260px 1fr;
  width: 100%;
  max-width: 1000px;
  
  /* Altura controlada relativa a Viewport */
  height: 80vh;
  max-height: 800px;
  min-height: 500px;

  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  
  /* Melhora performance da animação */
  will-change: transform, opacity;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: 90vh; 
    display: flex;
    flex-direction: column;
  }
}

/* SIDEBAR STYLES */
.sidebar {
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto; /* Permite scroll na sidebar se a tela for muito pequena */
}

.user-quick-info {
  text-align: center;
}

.avatar-small {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.welcome-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
  }

  &.active {
    background: linear-gradient(
      90deg,
     var(--accent-solid) 0%,
      transparent 100%
    );
    color: var(--accent);
    border-left: 3px solid var(--muted);
  }
}

.logout-btn {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 58, 48, 0.1);
  color: #ff3b30;
  border: 2px solid rgba(255, 59, 48, 0.4);
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 59, 48, 0.2);
    border-color: rgba(255, 59, 48, 0.6);
  }
}

/* CONTENT AREA STYLES */
.content-area {
  padding: 3rem;
  position: relative;
  /* Scroll apenas dentro do conteúdo e não na página */
  overflow-y: auto;
  height: 100%;
}

.tab-header {
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--text-muted);
  }
}

/* Visão Geral Styles */
.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
}

.avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #333;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  &:hover .edit-overlay {
    opacity: 1;
  }
}

.edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
}

.hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 10px;
}

.history-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }
    small {
      color: var(--text-muted);
    }
  }
}

/* Forms Styles */
.settings-form {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid var(--glass-border);
    background: var(--panel-bg);
    color: var(--text);
    font-family: inherit;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: var(--color-sky);
      box-shadow: 0 0 10px rgba(46, 163, 255, 0.2);
      background: rgba(255,255,255,0.5);
    }

    &::placeholder {
      color: var(--muted);
    }
  }
}

.btn-ghost {
  margin-top: 16px;
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text);
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-end;

  &:hover {
    border-color: var(--color-sky);
    background: rgba(255,255,255,0.15);
  }
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal Logout Confirmation */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 400px;
  max-width: 94%;
  padding: 24px;
  position: relative;

  h3 {
    margin: 0 0 12px;
    font-size: 1.5rem;
    color: var(--text);
  }
  p {
    margin: 0 0 20px;
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;

.btn-cancel {
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text);
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-end;

  &:hover {
    border-color: var(--color-sky);
    background: rgba(255,255,255,0.15);
  }
}
  .btn-danger {
    padding: 10px 16px;
    background: #ff4757;
    color: white;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255, 71, 87, 0.4);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

/* Theme Selector */
.theme-section {
  margin-top: 20px;
  h3 {
    margin-bottom: 16px;
    font-size: 1.1rem;
    color: var(--text);
  }
}

/* Password Validation Feedback */
.password-input {
  transition: all 0.3s ease;
  
  &.password-valid {
    border-color: #27ae60;
    background: rgba(39, 174, 96, 0.05);
  }
  
  &.password-invalid {
    border-color: #e74c3c;
    background: rgba(231, 76, 60, 0.05);
  }
}

.password-feedback {
  margin-top: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  transition: color 0.2s ease;
  
  svg {
    flex-shrink: 0;
  }
  
  &.met {
    color: #27ae60;
    font-weight: 500;
  }
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.theme-btn {
  position: relative;
  padding: 16px 12px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--color, transparent);
  }

  .theme-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  &:hover {
    border-color: var(--color-sky);
    background: rgba(255, 255, 255, 0.233);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--color-sky);
    background: var(--btn-hover);
    box-shadow: 0 8px 24px rgba(46, 163, 255, 0.15);
  }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .user-container {
    padding: 1rem;
  }
  .back-btn {
    left: 16px;
    top: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }
  .dashboard-card {
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    flex-direction: column;
  }
  .sidebar {
    padding: 1.5rem;
    gap: 1.5rem;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    order: 2;
    flex: 0 0 auto;
    min-height: 35vh;
  }
  .content-area {
    flex: 1 1 auto;
  }
  .avatar-small {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
  .welcome-text {
    font-size: 1rem;
  }
  .nav-btn {
    padding: 10px 12px;
    font-size: 0.9rem;
    gap: 8px;
  }
  .logout-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
  .content-area {
    padding: 1.5rem;
    order: 1;
  }
  .tab-header h2 {
    font-size: 1.5rem;
  }
  .avatar-large {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }
  .history-list li {
    flex-direction: column;
    gap: 4px;
  }
  .settings-form {
    max-width: 100%;
  }
  .form-group label {
    font-size: 0.85rem;
  }
  .form-group input {
    padding: 10px;
    font-size: 14px;
  }
  .btn-ghost {
    padding: 8px 14px;
    font-size: 0.9rem;
    width: auto;
    align-self: flex-end;
    margin-top: 16px;
  }
  .modal {
    width: 90%;
    padding: 16px;
  }
  .theme-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 10px;
  }
  .theme-btn {
    padding: 12px 8px;
  }
  .theme-name {
    font-size: 0.8rem;
  }
}


</style>