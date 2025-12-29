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
    <div class="login-card glass">
      <h1>Bem-vindo ao SkinSense AI</h1>
      <p>Insira suas informações para continuar.</p>
      <form @submit.prevent="submit">
        <label class="field">
          <span>Nome</span>
          <input v-model="name" required placeholder="Seu nome" />
        </label>
        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" required placeholder="seu@exemplo.com" />
        </label>
        <div class="actions">
          <button class="btn" type="submit">Entrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const name = ref('')
const email = ref('')
const router = useRouter()

onMounted(() => {
  // prefill if present
  const stored = JSON.parse(localStorage.getItem('skin_user') || 'null')
  if (stored) { name.value = stored.name; email.value = stored.email }
})

function submit() {
  const user = { name: name.value.trim(), email: email.value.trim() }
  localStorage.setItem('skin_user', JSON.stringify(user))
  toast.success('Bem-vindo, ' + user.name + '!')
  // smooth transition
  setTimeout(() => router.push('/home'), 350)
}
</script>

<style scoped>
.login-root { min-height: 100vh; padding: 48px; }
.login-card { width: 420px; max-width: 94%; padding: 28px; text-align: left; }
.login-card h1 { margin: 0 0 6px; font-size: 20px; }
.login-card p { margin: 0 0 18px; color: var(--muted); }
.field { display:block; margin-bottom:12px; }
.field span { display:block; font-size:12px; margin-bottom:6px; color:var(--muted); }
.field input { width:100%; padding:10px 12px; border-radius:10px; border:1px solid rgba(0,0,0,0.06); background: rgba(255,255,255,0.9); }
.actions { display:flex; justify-content:flex-end; margin-top:12px; }
.btn { min-width:110px; }
</style>