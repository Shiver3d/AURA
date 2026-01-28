

<template>
  <div class="search-root container">
    <header class="search-header">
      <h2>Produtos {{ searchQuery ? `- Resultado para "${searchQuery}"` : '' }}</h2>
      <div v-if="loading" class="loader">Carregando produtos...</div>
    </header>

    <div v-if="products.length > 0" class="grid">
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
        @select="open"
      />
    </div>

    <div v-else-if="!loading" class="empty-state glass">
      <p>Nenhum produto encontrado para sua busca.</p>
    </div>

    <!-- Mobile Search Input Bar -->
    <div class="mobile-search-bar glass">
      <input
        v-model="mobileSearchQuery"
        @keyup.enter="onMobileSearch"
        placeholder="Pesquisar..."
        aria-label="Pesquisar produtos"
        class="mobile-search-input"
      />
      <button @click="onMobileSearch" class="mobile-search-btn">
        <Icon icon="tabler:search" width="20" height="20" />
      </button>
    </div>

    <Transition name="fade">
      <div v-if="selected" class="modal-overlay" @click.self="selected = null">
        <div class="modal glass">
          <button class="close-btn" @click="selected = null">
            <Icon icon="lucide:x" width="20" />
          </button>
          
          <div class="modal-content">
            <img :src="selected.image_url || 'https://via.placeholder.com/300x300?text=Produto'" :alt="selected.name" class="modal-img" />
            <div class="modal-info">
              <div class="modal-header">
                <div>
                  <h3>{{ selected.name }}</h3>
                  <span v-if="selected.category" class="category-badge">{{ formatCategory(selected.category) }}</span>
                  
                  <!-- Tags do produto -->
                  <div v-if="hasTags" class="tags-row">
                    <span v-if="selected.rating > 4.5" class="tag green">
                      <Icon icon="lucide:star" width="12" /> Bem avaliado
                    </span>
                    <span v-if="selected.category === 'skincare'" class="tag blue">
                      <Icon icon="lucide:droplets" width="12" /> Cuidados
                    </span>
                    <span v-if="selected.category === 'makeup'" class="tag purple">
                      <Icon icon="lucide:palette" width="12" /> Maquiagem
                    </span>
                    <span v-if="selected.sustainable" class="tag sustainable">
                      <Icon icon="lucide:leaf" width="12" /> Sustentável
                    </span>
                    <span v-if="selected.inclusive" class="tag inclusive">
                      <Icon icon="lucide:heart-handshake" width="12" /> Inclusivo
                    </span>
                  </div>
                </div>
              </div>
              
              <p v-if="selected.description" class="description">{{ selected.description }}</p>
              
              <div class="product-details">
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
                  <Icon icon="lucide:shopping-bag" width="20" />
                  Adicionar ao Carrinho
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
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../services/supabase";
import { useAuth } from "../composables/useAuth";
import { Icon } from "@iconify/vue";
import ProductCard from "../components/MR/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const products = ref([]);
const loading = ref(false);
const selected = ref(null);
const searchQuery = ref(route.query.q || "");
const mobileSearchQuery = ref(route.query.q || "");

// Formatar categoria para exibição
const formatCategory = (category) => {
  const categories = {
    skincare: 'Cuidados com a Pele',
    makeup: 'Maquiagem',
    haircare: 'Cuidados com Cabelos',
    bodycare: 'Cuidados com o Corpo',
    tools: 'Ferramentas'
  }
  return categories[category] || category
}

// Formatar preço
const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2).replace('.', ',') : price
}

// Função para buscar produtos no Supabase
const fetchProducts = async () => {
  loading.value = true;
  const q = route.query.q || "";
  searchQuery.value = q;

  try {
    // 1. Registrar no histórico se o usuário estiver logado e houver busca
    if (user.value && q) {
      await supabase.from("search_history").insert([
        { user_id: user.value.id, query: q }
      ]);
    }

    // 2. Construir query de busca
    let query = supabase.from("products").select("*");

    if (q) {
      // Busca no nome ou na descrição (case-insensitive)
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    products.value = data || [];
  } catch (err) {
    console.error("Erro ao buscar produtos:", err.message);
  } finally {
    loading.value = false;
  }
};

// Abre o modal de detalhes
function open(product) {
  selected.value = product;
}

// Função para pesquisa mobile
function onMobileSearch() {
  const query = mobileSearchQuery.value.trim();
  if (query) {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }
}

// Verifica se há tags para exibir
const hasTags = computed(() => {
  if (!selected.value) return false;
  return selected.value.rating > 4.5 || 
         selected.value.category || 
         selected.value.sustainable || 
         selected.value.inclusive;
});

// Observa mudanças na URL (quando o usuário pesquisa algo novo no Header)
watch(() => route.query.q, () => {
  fetchProducts();
  mobileSearchQuery.value = route.query.q || "";
});

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped lang="scss">
.search-root {
  margin-top: 10vh;
  min-height: 80vh;
  padding: 20px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 20px;

  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
  }
}

.loader {
  color: var(--muted);
  font-size: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 28px;
  margin-bottom: 40px;
}

.empty-state {
  padding: 60px 40px;
  text-align: center;
  border-radius: 15px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    margin: 0;
    font-size: 1.2rem;
    color: var(--muted);
  }
}

/* Modal Estilo Premium */
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
  background: var(--bg);
  backdrop-filter: blur(12px) saturate(120%);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
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
  transition: all 0.3s ease;

  &:hover {
    background: rgba(46, 163, 255, 0.15);
    border-color: var(--color-sky);
    color: var(--color-sky);
  }
}

.modal-content {
  display: flex;
  gap: 32px;
  margin-bottom: 0;
}

.modal-img {
  width: 240px;
  height: 240px;
  object-fit: cover;
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

.category-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: var(--text);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: fit-content;
  backdrop-filter: blur(8px);
  margin-bottom: 12px;
}

[data-theme="dark"] .category-badge {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  font-size: 0.65rem;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid var(--glass-border);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  color: var(--text);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: var(--color-sky);
  }

  &.green {
    background: rgba(39, 174, 96, 0.25);
    color: #1a5f3a;
    border: 1.5px solid rgba(39, 174, 96, 0.6);

    &:hover {
      background: rgba(39, 174, 96, 0.35);
    }

    [data-theme="dark"] & {
      color: #52d685;
      background: rgba(39, 174, 96, 0.35);
      border-color: rgba(82, 214, 133, 0.6);
    }
  }

  &.blue {
    background: rgba(46, 163, 255, 0.2);
    color: #0066cc;
    border: 1.5px solid rgba(46, 163, 255, 0.5);

    &:hover {
      background: rgba(46, 163, 255, 0.3);
    }

    [data-theme="dark"] & {
      color: #6fd6ff;
      background: rgba(46, 163, 255, 0.3);
      border-color: rgba(111, 214, 255, 0.6);
    }
  }

  &.purple {
    background: rgba(138, 43, 255, 0.2);
    color: #5a0088;
    border: 1.5px solid rgba(138, 43, 255, 0.5);

    &:hover {
      background: rgba(138, 43, 255, 0.3);
    }

    [data-theme="dark"] & {
      color: #d695ff;
      background: rgba(138, 43, 255, 0.3);
      border-color: rgba(214, 149, 255, 0.6);
    }
  }

  &.sustainable {
    background: rgba(39, 174, 96, 0.25);
    color: #1a5f3a;
    border: 1.5px solid rgba(39, 174, 96, 0.6);

    &:hover {
      background: rgba(39, 174, 96, 0.35);
    }

    [data-theme="dark"] & {
      color: #52d685;
      background: rgba(39, 174, 96, 0.35);
      border-color: rgba(82, 214, 133, 0.6);
    }
  }

  &.inclusive {
    background: rgba(138, 43, 255, 0.2);
    color: #5a0088;
    border: 1.5px solid rgba(138, 43, 255, 0.5);

    &:hover {
      background: rgba(138, 43, 255, 0.3);
    }

    [data-theme="dark"] & {
      color: #d695ff;
      background: rgba(138, 43, 255, 0.3);
      border-color: rgba(214, 149, 255, 0.6);
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
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
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
}

@keyframes modalIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Mobile Search Input Bar */
.mobile-search-bar {
  display: none;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .search-root {
    margin-top: 8vh;
    min-height: 70vh;
    padding: 16px;
  }

  .search-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2rem;

    h2 {
      font-size: 1.4rem;
    }
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
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
  }

  .close-btn {
    width: 36px;
    height: 36px;
    right: 16px;
    top: 16px;
  }
}

@media (max-width: 480px) {
  .search-root {
    margin-top: 6vh;
    padding: 12px;
    padding-bottom: 16vh;
    display: flex;
    flex-direction: column;
  }

  .search-header {
    h2 {
      font-size: 1.2rem;
    }
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
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
    width: 36px;
    height: 36px;
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

  .mobile-search-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 41;
    display: flex;
    gap: 10px;
    padding: 10px;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid var(--glass-border);
    background: var(--panel-bg);
    backdrop-filter: blur(8px);
    margin: 0;
  }

  .search-root {
    margin-top: 8vh !important;
  }

  .mobile-search-input {
    flex: 1;
    padding: 8px 12px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    color: var(--text);
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &::placeholder {
      color: var(--muted);
    }

    &:focus {
      outline: none;
      border-color: var(--color-sky);
      box-shadow: 0 0 12px rgba(46, 163, 255, 0.15);
    }
  }

  .mobile-search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background: var(--accent-solid);
    border: 1px solid var(--color-sky);
    color: var(--color-sky);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
    font-weight: 600;

    &:hover {
      background: rgba(46, 163, 255, 0.25);
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>