<template>
  <div class="recommendation-root container">
    <header class="module-header glass">
      <div class="header-content">
        <h1>Olá, {{ user.name }}</h1>
        <p>Seu regime de beleza personalizado foi atualizado com base no seu perfil.</p>
        <p>Acaso deseje ajustar suas preferências, <span>você pode fazer isso aqui.</span></p>
      </div>
      <div class="header-icon">
        <Icon icon="lucide:sparkles" width="32" />
      </div>
    </header>

    <div class="layout-grid">
      <aside class="filters-panel glass">
        <div class="filters-header">
          <Icon icon="lucide:sliders-horizontal" />
          <h4>Preferências</h4>
        </div>
        
        <div class="filter-group">
          <label class="toggle-label">
            <span>Sustentabilidade</span>
            <div class="toggle-wrapper">
              <input type="checkbox" v-model="filters.sustainable" />
              <div class="toggle-switch"></div>
            </div>
          </label>
          
          <label class="toggle-label">
            <span>Inclusão</span>
            <div class="toggle-wrapper">
              <input type="checkbox" v-model="filters.inclusive" />
              <div class="toggle-switch"></div>
            </div>
          </label>
        </div>

        <div class="active-summary">
          <small>{{ recommendations.length }} produtos encontrados</small>
        </div>
      </aside>

      <main class="products-area">
        <div v-if="recommendations.length > 0" class="grid">
          <div
            v-for="p in recommendations"
            :key="p.id"
            class="product-card glass"
            @click="open(p)"
          >
            <div class="image-wrapper">
              <img :src="p.image_url" :alt="p.name" />
              <span class="score-badge">
                <Icon icon="lucide:star" width="12" /> {{ p.score }}
              </span>
            </div>
            
            <div class="card-content">
              <h4>{{ p.name }}</h4>
              <div class="tags">
                <span v-if="p.sustainable" class="tag green">
                  <Icon icon="lucide:leaf" width="10" /> Sustentável
                </span>
                <span v-if="p.inclusive" class="tag purple">
                  <Icon icon="lucide:heart-handshake" width="10" /> Inclusivo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state glass">
          <Icon icon="lucide:frown" width="48" />
          <p>Nenhum produto corresponde aos filtros selecionados.</p>
        </div>
      </main>
    </div>

    <Transition name="fade">
      <div v-if="selected" class="modal-overlay" @click.self="selected = null">
        <div class="modal glass">
          <button class="close-btn" @click="selected = null">
            <Icon icon="lucide:x" />
          </button>

          <div class="modal-content">
            <img :src="selected.image_url" class="modal-img" />
            
            <div class="modal-info">
              <div class="modal-header-info">
                <h3>{{ selected.name }}</h3>
                <div class="score-pill">Match: {{ selected.score }}/10</div>
              </div>

              <div class="badges-row">
                <span v-if="selected.sustainable" class="tag green">Sustentável</span>
                <span v-if="selected.inclusive" class="tag purple">Inclusivo</span>
              </div>

              <p class="description">
                [placeholder]Este produto foi selecionado especificamente para suas necessidades.
                Alta compatibilidade detectada.
              </p>

              <div class="modal-actions">
                <button class="btn">
                  <Icon icon="lucide:shopping-bag" /> Adicionar à Rotina
                </button>
              </div>

              <section class="reviews-section">
                <h4><Icon icon="lucide:message-circle" /> O que dizem:</h4>
                <ul class="reviews-list">
                  <li v-for="r in selected.reviews" :key="r.id" class="review-item">
                    <strong>{{ r.author }}</strong>
                    <p>{{ r.text }}</p>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue"; // Certifique-se de ter instalado: npm install @iconify/vue

const user = ref({ name: "Visitante" });

// Simulação de dados com imagens placeholders para visual
const catalog = ref([
  {
    id: 1,
    name: "La Roche-Posay Effaclar",
    sustainable: true,
    inclusive: true,
    score: 9.2,
    image_url: "https://placehold.co/400x400/e6f7ff/00b3ff?text=Effaclar",
    reviews: [{ id: 1, author: "Ana", text: "Mudou minha pele completamente!" }],
  },
  {
    id: 2,
    name: "Vichy Mineral 89",
    sustainable: false,
    inclusive: true,
    score: 8.1,
    image_url: "https://placehold.co/400x400/f0f8ff/1a7fe0?text=Vichy+89",
    reviews: [{ id: 2, author: "Carlos", text: "Hidratação leve e refrescante." }],
  },
  {
    id: 3,
    name: "Clean&Green Serum",
    sustainable: true,
    inclusive: false,
    score: 7.9,
    image_url: "https://placehold.co/400x400/e8ffef/27ae60?text=Bio+Serum",
    reviews: [{ id: 3, author: "Mariana", text: "Bom, mas a textura é densa." }],
  },
  {
    id: 4,
    name: "CeraVe Lotion",
    sustainable: false,
    inclusive: true,
    score: 8.5,
    image_url: "https://placehold.co/400x400/ffffff/333333?text=CeraVe",
    reviews: [{ id: 4, author: "Pedro", text: "Básico que funciona." }],
  },
]);

const filters = ref({ sustainable: true, inclusive: true });
const selected = ref(null);

onMounted(() => {
  const u = JSON.parse(localStorage.getItem("skin_user") || "null");
  if (u) user.value = u;
});

const recommendations = computed(() => {
  return catalog.value
    .filter((p) => (filters.value.sustainable ? p.sustainable : true))
    .filter((p) => (filters.value.inclusive ? p.inclusive : true))
    .sort((a, b) => b.score - a.score);
});

function open(p) {
  selected.value = p;
}
</script>

<style scoped lang="scss">
.recommendation-root {
  margin-top: 10vh;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header Section */
.module-header {
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    text-shadow: var(--txt-hover);
  }
  
  p {
    margin: 16px 0 0;
    color: var(--muted);
  }

  span {
    text-decoration: underline;
    cursor: pointer;
    color: var(--color-sky-dark);
  }

  span:hover {
    color: var(--color-sky);
  }

  .header-icon {
    color: var(--color-sky);
    background: rgba(255, 255, 255, 0.274);
    padding: 12px;
    border-radius: 50%;
    backdrop-filter: blur(4px);
  }
}

/* Layout Grid (Sidebar + Main) */
.layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

/* Sidebar Styling */
.filters-panel {
  padding: 20px;
  position: sticky;
  top: 110px; /* Sticky effect on scroll */
}

.filters-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--glass-border);
  
  h4 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text);
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Toggle Switch Styling */
.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--muted);
  transition: color 0.3s;

  &:hover {
    color: var(--text);
  }
}

.toggle-wrapper {
  position: relative;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-switch {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.1);
    border-radius: 34px;
    transition: .4s;
    border: 1px solid var(--glass-border);
  }
  
  .toggle-switch:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  input:checked + .toggle-switch {
    background: var(--accent-solid);
  }
  
  input:checked + .toggle-switch:before {
    transform: translateX(20px);
  }
}

.active-summary {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--glass-border);
  text-align: center;
  color: var(--muted);
}

/* Product Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 229, 255, 0.15);
    border-color: var(--color-sky);
  }
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  
  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    background: #fff;
    transition: transform 0.5s ease;
  }

  .score-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #ffd700;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 4px;
    backdrop-filter: blur(4px);
  }
}

.product-card:hover img {
  transform: scale(1.05);
}

.card-content {
  h4 {
    margin: 0 0 8px;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.green {
    background: var(--color-green);
    color: #0d5f35;
    border: 1px solid rgba(13, 95, 53, 0.1);
  }
  
  &.purple {
    background: rgba(187, 134, 252, 0.2);
    color: #8a2bff;
    border: 1px solid rgba(138, 43, 255, 0.1);
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* Modal Styling (Igual ao SearchView) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 750px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  color: var(--text);
  font-size: 24px;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.2s;
  
  &:hover { opacity: 1; transform: scale(1.1); }
}

.modal-content {
  display: flex;
  gap: 32px;
}

.modal-img {
  width: 280px;
  height: 280px;
  object-fit: contain;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.modal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.modal-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  
  h3 { margin: 0; font-size: 1.6rem; }
}

.score-pill {
  background: var(--accent);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.badges-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.description {
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 24px;
}

.reviews-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--glass-border);
  
  h4 {
    font-size: 1rem;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.review-item {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  strong { display: block; margin-bottom: 4px; color: var(--color-sky); }
  p { margin: 0; color: var(--muted); font-size: 0.85rem; }
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 240px 1fr;
  }
}

@media (max-width: 768px) {
  .recommendation-root {
    margin-top: 8vh;
    padding: 16px;
  }

  .module-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    
    .header-icon { display: none; }
  }

  .layout-grid {
    grid-template-columns: 1fr; /* Stack layout */
    gap: 16px;
  }

  .filters-panel {
    position: static;
    width: 100%;
    margin-bottom: 8px;
  }

  .filter-group {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .modal-content {
    flex-direction: column;
  }
  
  .modal-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .product-card { padding: 8px; }
  .image-wrapper { height: 120px; }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>