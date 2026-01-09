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
 display: none;
}

/* Responsive Design for Mobile & Tablet */
@media (max-width: 768px) {
  .ai-root {
    padding-top: 8vh;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 480px) {
  .ai-root {
    padding-top: 6vh;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
