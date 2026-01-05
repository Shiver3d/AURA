<!--
  Arquivo: src/App.vue
  Descrição: Layout base da aplicação.
  - Importa estilos globais, o componente `DynamicWaves` (fundo), Header/ Footer e controla o tema global.
  - O `router-view` é envolvido por uma transição chamada `route-zoom`.

  Como modificar:
  - Para alterar a lógica de persistência do tema, edite o `watchEffect` que sincroniza com localStorage.
  - Para remover o fundo, retire o componente `DynamicWaves` do template.
-->

<script setup>
import { useRoute } from 'vue-router'
import { watchEffect, ref, onMounted } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import FooterBar from './components/FooterBar.vue'
import DynamicWaves from './components/DynamicWaves.vue'
import './main.scss'

const route = useRoute()
const theme = ref(localStorage.getItem('theme') || 'dark')

// Inicializa o tema imediatamente na montagem
onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  
  // Escuta mudanças no localStorage para sincronizar entre componentes
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      theme.value = e.newValue || 'dark'
    }
  })
  
  // Também escuta mudanças customizadas (quando o HeaderBar atualiza o mesmo window)
  const handleThemeChange = () => {
    const newTheme = localStorage.getItem('theme') || 'dark'
    if (newTheme !== theme.value) {
      theme.value = newTheme
    }
  }
  window.addEventListener('theme-changed', handleThemeChange)
})

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem('theme', theme.value)
})
</script>

<template>
  <div id="app">
    <DynamicWaves />
    <HeaderBar v-if="route.path !== '/login' && route.path !== '/user'" />
    <transition name="route-zoom" mode="out-in">
      <router-view />
    </transition>
    <FooterBar v-if="route.path !== '/login' && route.path !== '/user'" />
  </div>
</template>

<style>
/* App-level spacing or overrides can go here */
</style>
