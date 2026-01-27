<template>
  <div class="recommendation-root container">
    <header class="module-header glass">
      <div class="header-content">
        <h1>Olá, {{ firstName }}</h1>
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
          <ProductCard
            v-for="p in recommendations"
            :key="p.id"
            :product="p"
            @select="open"
          />
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
            <Icon icon="lucide:x" width="20" />
          </button>

          <div class="modal-content">
            <img :src="selected.image_url" :alt="selected.name" class="modal-img" />
            
            <div class="modal-info">
              <div class="modal-header">
                <div>
                  <h3>{{ selected.name }}</h3>
                  <span v-if="selected.sustainable || selected.inclusive" class="badges-row">
                    <span v-if="selected.sustainable" class="badge sustainable">
                      <Icon icon="lucide:leaf" width="12" /> Sustentável
                    </span>
                    <span v-if="selected.inclusive" class="badge inclusive">
                      <Icon icon="lucide:heart-handshake" width="12" /> Inclusivo
                    </span>
                  </span>
                </div>
              </div>

              <p v-if="selected.description" class="description">{{ selected.description }}</p>

              <div class="product-details">
                <div class="detail-row" v-if="selected.score">
                  <span class="detail-label">Compatibilidade</span>
                  <span class="detail-value">{{ selected.score }}/10</span>
                </div>
                <div class="detail-row" v-if="selected.rating">
                  <span class="detail-label">Avaliação</span>
                  <span class="detail-value">⭐ {{ selected.rating.toFixed(1) }}</span>
                </div>
                <div class="detail-row" v-if="selected.reviews_count">
                  <span class="detail-label">Avaliações</span>
                  <span class="detail-value">{{ selected.reviews_count }}</span>
                </div>
                <div class="detail-row" v-if="selected.price">
                  <span class="detail-label">Preço</span>
                  <span class="price">R$ {{ formatPrice(selected.price) }}</span>
                </div>
              </div>

              <div class="modal-actions">
                <button class="btn-action">
                  <Icon icon="lucide:shopping-bag" width="20" /> Adicionar à Rotina
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import ProductCard from "./ProductCard.vue";
import { useAuth } from "../../composables";
import { supabase } from "../../services/supabase";
import { getAllProducts } from "../../services/products";

const { user } = useAuth();

// Cache de produtos para mapear imagens
const allProducts = ref([]);

const profile = ref({
  full_name: "",
});

// Computed para manter o firstName sincronizado com o database
const firstName = computed(() => {
  const fullName = profile.value.full_name || 
                   user.value?.user_metadata?.full_name || 
                   "Visitante";
  return fullName.split(" ")[0];
});

/**
 * Função helper para encontrar imagem de produto real baseado no nome
 * Busca por correspondência no banco de dados de produtos reais
 */
function getProductImage(productName) {
  if (!productName || !allProducts.value.length) return null;
  
  const found = allProducts.value.find(p => 
    p.name && p.name.toLowerCase() === productName.toLowerCase()
  );
  return found?.image_url || null;
}

// Simulação de dados com imagens placeholders para visual
const catalog = ref([
  {
    id: 1,
    name: "La Roche-Posay Effaclar",
    description: "Solução eficaz para pele oleosa e acneica",
    category: "skincare",
    sustainable: true,
    inclusive: true,
    score: 9.2,
    price: 89.90,
    rating: 4.8,
    reviews_count: 156,
    image_url: "https://placehold.co/400x400/e6f7ff/00b3ff?text=Effaclar",
    reviews: [{ id: 1, author: "Ana", text: "Mudou minha pele completamente!" }],
  },
  {
    id: 2,
    name: "Vichy Mineral 89",
    description: "Hidratante mineral com 89% de água termal",
    category: "skincare",
    sustainable: false,
    inclusive: true,
    score: 8.1,
    price: 64.90,
    rating: 4.5,
    reviews_count: 203,
    image_url: "https://placehold.co/400x400/f0f8ff/1a7fe0?text=Vichy+89",
    reviews: [{ id: 2, author: "Carlos", text: "Hidratação leve e refrescante." }],
  },
  {
    id: 3,
    name: "Clean&Green Serum",
    description: "Sérum 100% natural e sustentável",
    category: "skincare",
    sustainable: true,
    inclusive: false,
    score: 7.9,
    price: 79.90,
    rating: 4.6,
    reviews_count: 128,
    image_url: "https://placehold.co/400x400/e8ffef/27ae60?text=Bio+Serum",
    reviews: [{ id: 3, author: "Mariana", text: "Bom, mas a textura é densa." }],
  },
  {
    id: 4,
    name: "CeraVe Lotion",
    description: "Loção hidratante com ceramidas",
    category: "skincare",
    sustainable: false,
    inclusive: true,
    score: 8.5,
    price: 59.90,
    rating: 4.7,
    reviews_count: 340,
    image_url: "https://placehold.co/400x400/ffffff/333333?text=CeraVe",
    reviews: [{ id: 4, author: "Pedro", text: "Básico que funciona." }],
  },
  {
    id: 5,
    name: "Nyx Born to Glow",
    description: "Base líquida com acabamento radiante",
    category: "makeup",
    sustainable: false,
    inclusive: true,
    score: 8.3,
    price: 59.90,
    rating: 4.6,
    reviews_count: 289,
    image_url: "https://placehold.co/400x400/fff0f5/ff69b4?text=Born+to+Glow",
    reviews: [{ id: 5, author: "Julia", text: "Cobertura perfeita!" }],
  },
]);

const filters = ref({ sustainable: true, inclusive: true });
const selected = ref(null);

// Carregar dados do usuário do Supabase e produtos para mapear imagens
async function loadUserDataFromDatabase() {
  if (!user.value) return;
  
  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (profileData) {
      profile.value = profileData;
    }
  } catch (err) {
    console.log("Erro ao carregar dados do usuário:", err.message);
  }
}

// Carregar todos os produtos para mapear imagens dos recomendados
async function loadProductsForImageMapping() {
  try {
    const products = await getAllProducts();
    allProducts.value = products;
    
    // Atualizar imagens dos produtos no catálogo com base nos produtos reais
    catalog.value = catalog.value.map(catalogItem => {
      const imageUrl = getProductImage(catalogItem.name);
      if (imageUrl) {
        return {
          ...catalogItem,
          image_url: imageUrl
        };
      }
      return catalogItem;
    });
  } catch (err) {
    console.log("Erro ao carregar produtos para mapear imagens:", err.message);
  }
}

onMounted(() => {
  if (user.value) {
    loadUserDataFromDatabase();
    loadProductsForImageMapping();
  }
});

const recommendations = computed(() => {
  return catalog.value
    .filter((p) => (filters.value.sustainable ? p.sustainable : true))
    .filter((p) => (filters.value.inclusive ? p.inclusive : true))
    .sort((a, b) => b.score - a.score);
});

function open(product) {
  selected.value = product;
}

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2).replace('.', ',') : price
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

/* Product Grid - ProductCard styles now in components/MR/ProductCard.vue */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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

/* Modal Styling (Unificado) */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: var(--radius);
  border: 1px solid var(--glass-border);
  // Melhor contraste em light mode
  [data-theme="light"] & {
    background: rgba(248, 251, 255, 0.95);
    border: 1px solid rgba(46, 163, 255, 0.3);
  }
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  color: var(--text);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(46, 163, 255, 0.15);
    border-color: var(--color-sky);
    color: var(--color-sky);
    opacity: 1;
  }
}

.modal-content {
  display: flex;
  gap: 32px;
}

.modal-img {
  width: 240px;
  height: 240px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  flex-shrink: 0;
  border: 1px solid var(--glass-border);
}

.modal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  h3 {
    margin: 0 0 8px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
  }
}

.badges-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 6px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
  background: rgba(255, 255, 255, 0.05);

  &.sustainable {
    color: #27ae60;
    border-color: rgba(39, 174, 96, 0.3);
    background: rgba(39, 174, 96, 0.1);
  }

  &.inclusive {
    color: #bb86fc;
    border-color: rgba(138, 43, 255, 0.3);
    background: rgba(138, 43, 255, 0.1);
  }

  // Tag de cuidado - cores fixas preto e branco para máxima legibilidade em light/dark mode
  &.caution {
    color: #333333;
    border-color: #666666;
    background: #e8e8e8;
  }

  // Suporte para dark mode
  @media (prefers-color-scheme: dark) {
    &.caution {
      color: #f0f0f0;
      border-color: #999999;
      background: #333333;
    }
  }

  [data-theme="dark"] & {
    &.caution {
      color: #f0f0f0;
      border-color: #999999;
      background: #333333;
    }
  }
}

.description {
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.detail-label {
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-value {
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
}

.price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-sky);
  text-shadow: 0 0 12px rgba(46, 163, 255, 0.2);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
  width: 100%;
}

.btn-action {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  color: var(--text);
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: var(--glass-bg);
    border-color: var(--color-sky);
    color: var(--color-sky);
    box-shadow: 0 8px 16px rgba(46, 163, 255, 0.1);
  }

  &:active {
    opacity: 0.9;
  }

  // Melhor contraste em light mode
  [data-theme="light"] & {
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(46, 163, 255, 0.4);
    color: #0066cc;
  }

  [data-theme="light"] &:hover {
    background: rgba(46, 163, 255, 0.15);
    border-color: #0066cc;
    color: #0066cc;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 240px 1fr;
  }

  .modal {
    max-width: 90%;
    padding: 28px;
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

  .modal {
    max-width: 95%;
    padding: 24px;
    max-height: 90vh;
  }

  .modal-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .modal-img {
    width: 100%;
    height: 220px;
    object-fit: contain;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    right: 16px;
    top: 16px;
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

  .modal {
    padding: 20px;
    max-height: 95vh;
  }

  .modal-content {
    gap: 16px;
  }

  .modal-img {
    height: 180px;
  }

  .close-btn {
    right: 12px;
    top: 12px;
  }

  .modal-info {
    h3 {
      font-size: 1.3rem;
    }
  }

  .description {
    font-size: 0.9rem;
  }

  .price {
    font-size: 1.3rem;
  }

  .modal-actions {
    .btn-action {
      padding: 11px 12px;
      font-size: 0.85rem;
      gap: 6px;
    }
  }
}
</style>