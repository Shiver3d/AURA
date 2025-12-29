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
    <div class="user-panel glass">
      <div class="left">
        <div class="avatar">{{ initials }}</div>
        <h2>{{ user.name }}</h2>
        <div class="status">Membro SkinSense</div>
      </div>
      <div class="right">
        <h3>Histórico de Beleza</h3>
        <ul class="history">
          <li v-for="item in history" :key="item.id" @click="open(item)" class="history-item">
            <div class="title">{{ item.name }}</div>
            <div class="meta">{{ item.meta }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="selected" class="modal-overlay" @click.self="selected=null">
      <div class="modal glass">
        <button class="close" @click="selected=null">Fechar</button>
        <h3>{{ selected.name }}</h3>
        <p>{{ selected.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = ref({ name: 'Visitante' })
onMounted(()=>{ const u = JSON.parse(localStorage.getItem('skin_user')||'null'); if(u) user.value = u })

const initials = computed(()=> user.value.name ? user.value.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() : 'VS')

const history = ref([
  { id:1, name:'Vichy Mineral 89', meta:'Usado: 2025-10-12', description:'Hidratante leve para rotina matinal.' },
  { id:2, name:'La Roche-Posay Effaclar', meta:'Usado: 2025-08-01', description:'Sérum para pele oleosa.' }
])

const selected = ref(null)
function open(i){ selected.value = i }
</script>

<style scoped>
.user-root { min-height:100vh; padding:48px; display:flex; align-items:center; justify-content:center; }
.user-panel { width:980px; display:flex; gap:24px; padding:24px; }
.left { width:320px; text-align:center; }
.avatar { width:160px; height:160px; margin:0 auto 12px; border-radius:20px; background:var(--accent-solid); display:flex; align-items:center; justify-content:center; color:white; font-size:36px; }
.status { color:var(--muted); margin-top:8px; }
.right { flex:1; }
.history { list-style:none; padding:0; margin:0; }
.history-item { padding:12px; border-radius:10px; margin-bottom:8px; cursor:pointer; }
.history-item:hover { transform:translateY(-4px); }
.modal-overlay { position:fixed; inset:0; background: rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:60; }
.modal { width:640px; max-width:94%; padding:18px; position:relative; }
.close { position:absolute; right:12px; top:12px; }
</style>