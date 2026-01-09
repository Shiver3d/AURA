

<template>
  <div class="search-root container">
    <header class="search-header">
      <h2>Produtos {{ searchQuery ? `- Resultado para "${searchQuery}"` : '' }}</h2>
      <div v-if="loading" class="loader">Carregando produtos...</div>
    </header>

    <div v-if="products.length > 0" class="grid">
      <div
        v-for="p in products"
        :key="p.id"
        class="product card glass"
        @click="open(p)"
      >
        <img :src="p.image_url" :alt="p.name" />
        <h4>{{ p.name }}</h4>
        <div class="tags">
          <span class="tag">{{ p.brand }}</span>
          <span class="tag green" v-if="p.tags?.includes('sustentavel')">Selo Verde</span>
          <span class="tag" v-if="p.tags?.includes('refil')">Refilável</span>
        </div>
      </div>
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
            <img :src="selected.image_url" class="modal-img" />
            <div class="modal-info">
              <h3>{{ selected.name }}</h3>
              <span class="brand-badge">{{ selected.brand }}</span>
              <p class="description">{{ selected.description }}</p>
              
              <div class="modal-actions">
                <button class="btn btn-primary">Comprar Agora</button>
              </div>
            </div>
          </div>

          <section class="reviews">
            <h4>Avaliações da Comunidade</h4>
            <ul v-if="selected.reviews?.length">
              <li v-for="r in selected.reviews" :key="r.id">
                <strong>{{ r.author }}</strong>: {{ r.text }}
              </li>
            </ul>
            <p v-else class="no-reviews">Seja o primeiro a avaliar este produto!</p>
          </section>
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

const route = useRoute();
const { user } = useAuth();

const products = ref([]);
const loading = ref(false);
const selected = ref(null);
const searchQuery = ref(route.query.q || "");

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
function open(p) {
  selected.value = p;
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
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 25px;
}

.product {
  padding: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 229, 255, 0.2);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    background: white; // Produtos costumam ter fundo branco
    border-radius: 12px;
    margin-bottom: 12px;
  }
}

.empty-state {
  padding: 40px;
  text-align: center;
  border-radius: 15px;
}

/* Modal Estilo PlayStation/Aero */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  position: relative;
  animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.modal-content {
  display: flex;
  gap: 30px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.modal-img {
  width: 250px;
  height: 250px;
  object-fit: contain;
  background: white;
  border-radius: 15px;
}

.brand-badge {
  display: inline-block;
  background: rgba(0, 229, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.description {
  line-height: 1.6;
  margin-bottom: 2rem;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  
  .search-header h2 {
    font-size: 20px;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
  
  .product img {
    height: 140px;
    margin-bottom: 8px;
  }
  
  .product h4 {
    font-size: 14px;
  }
  
  .tags {
    font-size: 11px;
  }
  
  .modal-content {
    gap: 16px;
  }
  
  .modal-img {
    width: 180px;
    height: 180px;
  }
  
  .modal-info {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .search-root {
    margin-top: 6vh;
    padding: 8px;
  }
  
  .search-header {
    margin-bottom: 1rem;
  }
  
  .search-header h2 {
    font-size: 16px;
    word-break: break-word;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .product {
    padding: 10px;
  }
  
  .product img {
    height: 120px;
  }
  
  .product h4 {
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  .tags {
    font-size: 10px;
    gap: 4px;
  }
  
  .tag {
    padding: 2px 6px;
  }
  
  .empty-state {
    padding: 20px;
    font-size: 14px;
  }
  
  .modal {
    width: 100%;
    max-width: none;
    padding: 16px;
    max-height: 95vh;
  }
  
  .close-btn {
    right: 10px;
    top: 10px;
    font-size: 20px;
  }
  
  .modal-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .modal-img {
    width: 100%;
    height: 150px;
  }
  
  .modal-info h3 {
    font-size: 18px;
  }
  
  .brand-badge {
    font-size: 0.75rem;
    padding: 2px 8px;
  }
  
  .description {
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .reviews {
    margin-top: 1rem;
  }
  
  .reviews h4 {
    font-size: 14px;
  }
  
  .reviews li {
    font-size: 12px;
    margin-bottom: 8px;
  }
}
</style>