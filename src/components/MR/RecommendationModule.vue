<!--
  Arquivo: src/components/MR/RecommendationModule.vue
  Descrição: Módulo de recomendação simples usado pela rota `AIAnalysisView`.
  - Mantém um catálogo local de produtos, filtros reativos e uma lista de recomendações computada.
  - `filters` controla quais produtos passam no resultado; `recommendations` ordena por `score`.

  Como modificar:
  - Para conectar a uma API real, substitua `catalog` por fetch/axios e atualize `recommendations` conforme necessário.
  - Para adicionar novos filtros, insira chaves em `filters` e inclua checagem em `recommendations`.
-->

<script setup>
import { ref, computed, onMounted } from "vue";

const user = ref({ name: "Visitante" });
onMounted(() => {
  const u = JSON.parse(localStorage.getItem("skin_user") || "null");
  if (u) user.value = u;
});

const filters = ref({ sustainable: true, inclusive: true });

const catalog = ref([
  {
    id: 1,
    name: "La Roche-Posay Effaclar",
    sustainable: true,
    inclusive: true,
    score: 9.2,
    reviews: [{ id: 1, author: "Ana", text: "Mudou minha pele!" }],
  },
  {
    id: 2,
    name: "Vichy Mineral 89",
    sustainable: false,
    inclusive: true,
    score: 8.1,
    reviews: [{ id: 2, author: "Carlos", text: "Ótima hidratação." }],
  },
  {
    id: 3,
    name: "Clean&Green Serum",
    sustainable: true,
    inclusive: false,
    score: 7.9,
    reviews: [{ id: 3, author: "Mariana", text: "Leve e eficaz." }],
  },
]);

const recommendations = computed(() => {
  return catalog.value
    .filter((p) => (filters.value.sustainable ? p.sustainable : true))
    .filter((p) => (filters.value.inclusive ? p.inclusive : true))
    .sort((a, b) => b.score - a.score);
});

const selected = ref(null);
function open(p) {
  selected.value = p;
}
function toggleFilter(k) {
  filters.value[k] = !filters.value[k];
}
</script>

<template>
  <section class="mr-i container">
    <header class="mr-i-status-panel glass">
      <h2>Olá {{ user.name }}, bom lhe ver novamente.</h2>
      <h3>Seu Regime de Beleza Personalizado Está Pronto!</h3>
    </header>

    <aside class="mr-i-filters glass">
      <h4>Filtros</h4>
      <div class="filter-list">
        <label
          ><input type="checkbox" v-model="filters.sustainable" />
          Sustentabilidade</label
        >
        <label
          ><input type="checkbox" v-model="filters.inclusive" /> Inclusão</label
        >
      </div>
    </aside>

    <div class="mr-i-product-list">
      <h2>Produtos Recomendados</h2>
      <div class="product-grid">
        <div
          v-for="p in recommendations"
          :key="p.id"
          class="prod card glass"
          @click="open(p)"
        >
          <h4>{{ p.name }}</h4>
          <div class="meta">Score: {{ p.score }}</div>
          <div class="badges">
            <span v-if="p.sustainable" class="badge green">Sustentável</span>
            <span v-if="p.inclusive" class="badge">Inclusivo</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selected" class="modal-overlay" @click.self="selected = null">
      <div class="modal glass">
        <button class="close" @click="selected = null">Fechar</button>
        <h3>{{ selected.name }}</h3>
        <p>Score: {{ selected.score }}</p>
        <section class="reviews">
          <h4>Avaliações</h4>
          <ul>
            <li v-for="r in selected.reviews" :key="r.id">
              {{ r.author }} — {{ r.text }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mr-i {
  padding: 18px;
}
.mr-i-status-panel {
  padding: 14px;
  margin-bottom: 12px;
}
.mr-i-filters {
  padding: 12px;
  display: inline-block;
  margin-bottom: 14px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
.prod {
  padding: 12px;
  cursor: pointer;
}
.badge {
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
}
.badge.green {
  background: linear-gradient(90deg, #e6fff7, #d0fff0);
}
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 80;
}
.modal {
  width: 720px;
  max-width: 94%;
  padding: 18px;
}
.close {
  position: absolute;
  right: 12px;
  top: 12px;
}
</style>
