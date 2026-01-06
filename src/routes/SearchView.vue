<!--
  Arquivo: src/routes/SearchView.vue
  Descrição: Tela de listagem de produtos com modal de detalhe.
  - Template: grid responsivo de produtos com tags (sustentabilidade, refill).
  - Script: mantém `products` e `selected` em refs; abre modal ao clicar em produto.

  Como modificar:
  - Para integrar com API, substitua o array `products` por uma chamada fetch/axios.
  - Para adicionar filtros, crie refs para estados de filtro e filtre `products` dinamicamente.
-->

<template>
  <div class="search-root container">
    <h2>Produtos</h2>
    <div class="grid">
      <div
        v-for="p in products"
        :key="p.id"
        class="product card glass"
        @click="open(p)"
      >
        <img :src="p.image" alt="" />
        <h4>{{ p.name }}</h4>
        <div class="tags">
          <span class="tag">{{ p.brand }}</span>
          <span class="tag green" v-if="p.sustainable">Selo Verde</span>
          <span class="tag" v-if="p.refill">Refilável</span>
        </div>
      </div>
    </div>

    <div v-if="selected" class="modal-overlay" @click.self="selected = null">
      <div class="modal glass">
        <button class="close" @click="selected = null">Fechar</button>
        <h3>{{ selected.name }}</h3>
        <p>{{ selected.description }}</p>
        <div class="modal-actions">
          <button class="btn">Comprar</button>
        </div>
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const q = route.query.q || "";

const products = ref([
  {
    id: 1,
    name: "La Roche-Posay Effaclar",
    brand: "La Roche-Posay",
    sustainable: true,
    refill: false,
    image: "/src/assets/sample1.jpg",
    description: "Cuidado para pele oleosa.",
    reviews: [{ id: 1, author: "Ana", text: "Excelente!" }],
  },
  {
    id: 2,
    name: "Vichy Mineral 89",
    brand: "Vichy",
    sustainable: false,
    refill: true,
    image: "/src/assets/sample2.jpg",
    description: "Hidratante leve.",
    reviews: [{ id: 2, author: "Carlos", text: "Rápido efeito." }],
  },
]);

const selected = ref(null);
function open(p) {
  selected.value = p;
}
</script>

<style scoped>
.search-root {
margin-top: 6vh;
}



.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-top: 16px;
}
.product {
  padding: 12px;
  cursor: pointer;
}
.product img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}
.tags {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.tag {
  background: rgba(0, 0, 0, 0.04);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.tag.green {
  background: linear-gradient(90deg, #e6fff7, #d0fff0);
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
.reviews {
  margin-top: 12px;
}
</style>
