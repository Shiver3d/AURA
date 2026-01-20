

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

    <Transition name="fade">
      <div v-if="selected" class="modal-overlay" @click.self="selected = null">
        <div class="modal glass">
          <button class="close-btn" @click="selected = null">
            <Icon icon="lucide:x" />
          </button>
          
          <div class="modal-content">
            <img :src="selected.image_url || 'https://via.placeholder.com/300x300?text=Produto'" class="modal-img" />
            <div class="modal-info">
              <h3>{{ selected.name }}</h3>
              <span v-if="selected.category" class="category-badge">{{ formatCategory(selected.category) }}</span>
              <p v-if="selected.description" class="description">{{ selected.description }}</p>
              
              <div class="rating-section" v-if="selected.rating">
                <span class="rating">⭐ {{ selected.rating.toFixed(1) }}</span>
                <span v-if="selected.reviews_count" class="reviews-count">({{ selected.reviews_count }} avaliações)</span>
              </div>
              
              <div class="price-section" v-if="selected.price">
                <span class="price">R$ {{ formatPrice(selected.price) }}</span>
              </div>
              
              <div class="modal-actions">
                <button class="btn btn-primary">Adicionar ao Carrinho</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../services/supabase";
import { useAuth } from "../composables/useAuth";
import { Icon } from "@iconify/vue";
import ProductCard from "../components/MR/ProductCard.vue";

const route = useRoute();
const { user } = useAuth();

const products = ref([]);
const loading = ref(false);
const selected = ref(null);
const searchQuery = ref(route.query.q || "");

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

// Observa mudanças na URL (quando o usuário pesquisa algo novo no Header)
watch(() => route.query.q, () => {
  fetchProducts();
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
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  position: relative;
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 20px;
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
    background: rgba(0, 229, 255, 0.2);
    border-color: rgba(0, 229, 255, 0.4);
  }
}

.modal-content {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

.modal-img {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 16px;
  flex-shrink: 0;
}

.modal-info {
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0 0 12px;
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text);
  }
}

.category-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(0, 229, 255, 0.1));
  border: 1px solid rgba(0, 229, 255, 0.3);
  color: #00e5ff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.description {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 20px;
  font-size: 1rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .rating {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffd700;
  }

  .reviews-count {
    color: var(--muted);
    font-size: 0.9rem;
  }
}

.price-section {
  margin-bottom: 24px;

  .price {
    font-size: 2rem;
    font-weight: 800;
    color: #00e5ff;
    text-shadow: 0 0 12px rgba(0, 229, 255, 0.3);
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;

  .btn {
    flex: 1;
    padding: 14px 24px;
    background: linear-gradient(135deg, #00e5ff, #0099cc);
    color: #000;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 229, 255, 0.3);
    }

    &:active {
      transform: translateY(-2px);
    }
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
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

  .modal-content {
    flex-direction: column;
    gap: 20px;
  }

  .modal-img {
    width: 100%;
    height: auto;
    max-height: 250px;
  }
}

@media (max-width: 480px) {
  .search-root {
    margin-top: 6vh;
    padding: 12px;
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
  }

  .close-btn {
    right: 12px;
    top: 12px;
    width: 36px;
    height: 36px;
  }

  .modal-content {
    gap: 16px;
  }

  .modal-img {
    max-height: 200px;
  }

  .modal-info {
    h3 {
      font-size: 1.3rem;
    }
  }

  .description {
    font-size: 0.9rem;
  }

  .price-section .price {
    font-size: 1.6rem;
  }

  .modal-actions {
    .btn {
      padding: 12px 16px;
      font-size: 0.9rem;
    }
  }
}
</style>