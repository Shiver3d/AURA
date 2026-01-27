<!--
  Arquivo: src/routes/LoginView.vue
  Descrição: Tela de login principal.
  - Template: Card glassmorphism central com formulário de nome e e-mail.
  - Script: mantém `name` e `email` em refs, persiste em localStorage e redireciona para `/home`.
  - Style: estilos scoped para layout do card.

  Como modificar:
  - Mude placeholders e campos do formulário para capturar mais dados.
  - Para alterar a transição visual ao logar, edite a chamada `router.push('/home')` e adicione classes de animação.
-->

<template>
  <div class="login-root center" :class="$rootClass">
    <transition name="fade" mode="out-in">
      <div class="login-card glass" :key="isSignup">
      <h1>Bem-vindo ao AURA</h1>
      <p>Faça login ou crie uma conta para continuar.</p>
      <form @submit.prevent="submit">
        <label class="field" v-if="isSignup">
          <span>Nome</span>
          <input 
            v-model="name" 
            placeholder="Seu nome, como será visto e chamado."
            @input="sanitizeName" 
          />
        </label>
        <label class="field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="seuemail@exemplo.com"
          />
        </label>
        <label class="field">
          <span>Senha</span>
          <!-- Componente reutilizável de input de senha com validação -->
          <PasswordInput
            v-model="password"
            :show-validation="isSignup"
            placeholder="Mínimo 8 caracteres, 1 número, 1 caractere especial"
            @validation-change="handlePasswordValidation"
          />
        </label>
        
        <label class="remember-label" v-if="!isSignup">
          <div class="toggle-wrapper">
            <input type="checkbox" v-model="rememberMe" />
            <div class="toggle-switch"></div>
          </div>
          <span>Lembrar de mim neste dispositivo</span>
        </label>

        <div class="actions">
          <button class="btn" type="submit" :disabled="loading || (isSignup && !isPasswordValid)">
            {{ isSignup ? "Criar conta" : "Entrar" }}
          </button>
        </div>
        <p>
          <button class="link" @click="toggleMode" type="button">
            {{ isSignup ? "Clique aqui para entrar na sua conta." : "Clique aqui para criar conta AURA." }}
          </button>
        </p>

        <p>
          <button class="link" @click="openRecovery" type="button">Recuperar senha</button>
        </p>
      </form>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="loading" class="overlay">
      <div class="spinner">Carregando...</div>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="showPopup" class="modal">
      <div class="modal-card">
        <h3>Atenção</h3>
        <p>{{ popupMessage }}</p>
        <div class="modal-actions">
          <button class="btn" @click="closePopup">Fechar</button>
        </div>
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="showRecovery" class="modal">
      <div class="modal-card">
        <h3>Recuperar senha</h3>
        <p>Insira seu e-mail para receber instruções de recuperação.</p>
        <div class="form-group">
          <input 
            v-model="recoveryEmail" 
            type="email" 
            placeholder="seuemail@exemplo.com"
            class="recovery-input"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeRecovery">Cancelar</button>
          <button class="btn" @click="sendRecovery">Enviar</button>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { useAuth } from "../composables";
import PasswordInput from "../components/PasswordInput.vue";

const name = ref("");
const email = ref("");
const password = ref("");
const isSignup = ref(false);
const loading = ref(false);
const rememberMe = ref(false);
const isPasswordValid = ref(false);

const showPopup = ref(false);
const popupMessage = ref("");

const showRecovery = ref(false);
const recoveryEmail = ref("");

const router = useRouter();
const { signIn, signUp, getCurrentUser } = useAuth();

// Carregar credenciais salvas ao montar o componente
onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedCreds = JSON.parse(localStorage.getItem('skin_saved_credentials') || 'null');
    if (savedCreds && savedCreds.email && savedCreds.password) {
      email.value = savedCreds.email;
      password.value = savedCreds.password;
      rememberMe.value = true;
    }
  }
});

function toggleMode() {
  isSignup.value = !isSignup.value;
  // Resetar checkbox ao alternar modo
  rememberMe.value = false;
  isPasswordValid.value = false;
}

/**
 * Handle da validação de senha do componente PasswordInput
 * Usado para desabilitar/habilitar o botão de submit em modo signup
 */
function handlePasswordValidation(isValid) {
  isPasswordValid.value = isValid;
}

function openRecovery() {
  recoveryEmail.value = email.value || "";
  showRecovery.value = true;
}

function closeRecovery() {
  showRecovery.value = false;
}

function closePopup() {
  showPopup.value = false;
}

function sanitizeName() {
  // Remove números e caracteres especiais, mantém apenas letras, espaços e acentos
  name.value = name.value.replace(/[0-9!@#$%^&*(),.?":{}|<>/\\]/g, '');
}

async function sendRecovery() {
  // Placeholder: show toast and close modal. Integrar com supabase se desejar.
  if (!recoveryEmail.value) {
    toast.error("Insira um e-mail válido para recuperação.");
    return;
  }
  showRecovery.value = false;
  toast.success("Se este e-mail estiver cadastrado, instruções foram enviadas.");
}

async function submit() {
  loading.value = true;
  try {
    if (isSignup.value) {
      // Validação de senha já é feita pelo PasswordInput component
      // Só prosseguir se a senha for válida
      if (!isPasswordValid.value) {
        toast.error("Senha não atende aos requisitos mínimos.");
        loading.value = false;
        return;
      }
      await signUp(email.value, password.value, name.value);
      toast.success("Conta criada. Verifique seu e-mail se necessário.");

      // salva perfil persistente por email
      const profilesRaw = localStorage.getItem("skin_profiles") || "{}";
      const profiles = JSON.parse(profilesRaw);
      const profile = { name: name.value.trim(), email: email.value.trim(), avatar: null };
      profiles[email.value.trim()] = profile;
      localStorage.setItem("skin_profiles", JSON.stringify(profiles));

      // define usuário atual
      localStorage.setItem("skin_user", JSON.stringify(profile));
      
      // Limpar credenciais salvas após signup (já que é uma nova conta)
      localStorage.removeItem('skin_saved_credentials');
    } else {
      await signIn(email.value, password.value);
      toast.success("Login efetuado com sucesso!");

      // Salvar credenciais ANTES de redirecionar
      if (rememberMe.value) {
        const credsToSave = {
          email: email.value.trim(),
          password: password.value
        };
        localStorage.setItem('skin_saved_credentials', JSON.stringify(credsToSave));
      } else {
        // Remover credenciais salvas se desmarcado
        localStorage.removeItem('skin_saved_credentials');
      }

      // carrega perfil persistente por email (se existir)
      const profilesRaw = localStorage.getItem("skin_profiles") || "{}";
      const profiles = JSON.parse(profilesRaw);
      const p = profiles[email.value.trim()];
      const profile = p || { name: name.value.trim(), email: email.value.trim(), avatar: null };
      // persiste profile caso não existisse
      profiles[email.value.trim()] = profile;
      localStorage.setItem("skin_profiles", JSON.stringify(profiles));
      localStorage.setItem("skin_user", JSON.stringify(profile));
    }

    await getCurrentUser();
    setTimeout(() => router.push("/home"), 250);
  } catch (err) {
    console.error(err);
    toast.error(err?.message || "Erro ao autenticar");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-root {
  min-height: 100vh;
  padding: 48px;
}
.login-card {
  width: 30vw;
  padding: 40px;
  text-align: left;
}
.login-card h1 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  text-shadow: var(--txt-hover);
}
.login-card p {
  font-size: 20px;
  margin: 16px 0 10px;
  color: var(--muted);
}
.field {
  display: block;
  margin-bottom: 12px;
}
.field span {
  display: block;
  font-size: 16px;
  margin-bottom: 6px;
  color: var(--muted);
  
}
.field input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 8px;
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.field input::placeholder {
  color: var(--muted);
}

.field input:focus {
  outline: none;
  border-color: var(--color-sky);
  box-shadow: 0 0 12px rgba(46, 163, 255, 0.2);
  background: rgba(255, 255, 255, 0.5);
}

/* Remember Me Checkbox */
.remember-label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  margin: 12px 0 16px;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--muted);
  transition: color 0.3s;
}

.remember-label:hover {
  color: var(--text);
}

.toggle-wrapper {
  position: relative;
  width: 44px;
  height: 24px;
  display: inline-block;
}

.toggle-wrapper input {
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.toggle-wrapper .toggle-switch {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.1);
  border-radius: 34px;
  transition: background-color 0.4s ease;
  border: 1px solid var(--glass-border);
  z-index: 1;
  pointer-events: none;
}

.toggle-wrapper .toggle-switch::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.4s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-wrapper input:checked + .toggle-switch {
  background-color: var(--accent-solid);
  border-color: var(--accent-solid);
}

.toggle-wrapper input:checked + .toggle-switch::before {
  transform: translateX(20px);
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.btn {
  justify-content: center;
  width: 30vw;
  min-width: 120px;
  transition: all 0.3s ease, transform 0.2s ease;
}

.link {
  text-align: center;
  background: none;
  border: none;
  padding-top: 1rem;
  color: var(--accent);
  cursor: pointer;
}

.link:hover {
  transition: ease-in-out 200ms;
  text-decoration: underline;
  text-shadow: var(--txt-hover);
}

/* transitions and modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.card-enter-active, .card-leave-active {
  transition: transform 240ms cubic-bezier(.2,.9,.3,1), opacity 200ms ease;
}
.card-enter-from {
  transform: translateY(8px) scale(.995);
  opacity: 0;
}
.card-leave-to {
  transform: translateY(-6px) scale(.995);
  opacity: 0;
}
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  z-index: 80;
}
.spinner {
  padding: 18px 26px;
  background: rgba(255,255,255,0.96);
  border-radius: 12px;
  color: black;
  font-weight: 600;
}
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.28);
  z-index: 90;
}
.modal-card {
  width: 360px;
  max-width: 94%;
  background: var(--bg);
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(2,6,23,0.16);

  h3 {
    margin: 0 0 12px;
    font-weight: 600;
    color: var(--text);
  }

  p {
    margin: 0 0 16px;
    color: var(--muted);
    font-size: 0.95rem;
  }
}

.form-group {
  margin-bottom: 16px;
}

.recovery-input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 8px;
  border: 2px solid var(--glass-border);
  background: var(--glass-bg);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.recovery-input::placeholder {
  color: var(--muted);
}

.recovery-input:focus {
  outline: none;
  border-color: var(--color-sky);
  box-shadow: 0 0 12px rgba(46, 163, 255, 0.2);
  background: rgba(255, 255, 255, 0.5);
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-secondary {
  background: var(--panel-bg) !important;
  border: 2px solid var(--glass-border) !important;
  color: var(--text) !important;

  &:hover {
    border-color: var(--muted) !important;
    background: var(--glass-bg) !important;
  }
}

/* Transitions - Fade suave como UserView */
.fade-enter-active, .fade-leave-active {
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .login-card {
    width: 95%;
    padding: 20px;
  }
  .login-card h1 {
    font-size: 18px;
  }
  .login-card p {
    font-size: 14px;
    margin-bottom: 14px;
  }
  .field input {
    font-size: 16px;
  }
  .actions {
    flex-direction: column;
    align-items: center;
  }
  .btn {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .login-root {
    padding: 24px;
  }
  .login-card {
    width: 100%;
    padding: 16px;
  }
  .field {
    margin-bottom: 10px;
  }
  .field span {
    font-size: 11px;
  }
  .link {
    padding-top: 0.8rem;
    font-size: 13px;
  }
  .modal-card {
    width: 100%;
    max-width: none;
    padding: 16px;
  }
  .modal-card h3 {
    font-size: 1.1rem;
  }
}

</style>
