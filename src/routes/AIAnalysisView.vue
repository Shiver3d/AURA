<!--
  Arquivo: src/routes/AIAnalysisView.vue
  Descrição: View que encapsula o módulo de Recomendação Inteligente (`RecommendationModule`).
  - Serve como wrapper/entry para o MR (Módulo de Recomendação) exibido dentro do dashboard.

  Como modificar:
  - Se quiser transformar isso em rota com parâmetros, aceite `props`/query e repasse para o componente.
-->

<template>
  <div class="ai-root container">
    <h1>MR-I — Módulo de Recomendação Inteligente</h1>
    <RecommendationModule />
  </div>
</template>

<script setup>
import RecommendationModule from "../components/MR/RecommendationModule.vue";
</script>

<style scoped>
.ai-root {
  padding-top: 30px;
}
.ai-root h1 {
  margin-bottom: 12px;
}
</style>
