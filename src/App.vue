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
import { useKeyboardShortcuts } from './composables'
import './main.scss'

const route = useRoute()

// Ativa atalhos de teclado globalmente
useKeyboardShortcuts()

// Detecta tema do navegador na primeira visita
const getInitialTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved) return saved
  
  // Verifica preferência do sistema operacional
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const theme = ref(getInitialTheme())
const colorTheme = ref(localStorage.getItem('colorTheme') || 'blue')

// Inicializa o tema imediatamente na montagem
onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  document.documentElement.setAttribute('data-color', colorTheme.value)
  
  // Escuta mudanças no localStorage para sincronizar entre componentes
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      theme.value = e.newValue || 'dark'
    }
    if (e.key === 'colorTheme') {
      colorTheme.value = e.newValue || 'blue'
    }
  })
  
  // Escuta eventos customizados para mudanças de tema
  const handleThemeChange = () => {
    const newTheme = localStorage.getItem('theme') || 'dark'
    if (newTheme !== theme.value) {
      theme.value = newTheme
    }
  }
  const handleColorChange = () => {
    const newColor = localStorage.getItem('colorTheme') || 'blue'
    if (newColor !== colorTheme.value) {
      colorTheme.value = newColor
    }
  }
  window.addEventListener('theme-changed', handleThemeChange)
  window.addEventListener('color-changed', handleColorChange)
})

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  document.documentElement.setAttribute('data-color', colorTheme.value)
  localStorage.setItem('theme', theme.value)
  localStorage.setItem('colorTheme', colorTheme.value)
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
</style>
