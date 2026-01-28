<!--
  Arquivo: src/routes/HomeView.vue
  Descrição: Dashboard inicial estilo XMB — hero com ações rápidas e cards informativos.
  - Template: seção `hero` com botões para Diagnóstico e Produtos; cards flutuantes para destaque.
  - Script: carrega `anime.js` dinamicamente para animações suaves dos cards (fallback simples se falhar).

  Como modificar:
  - Para alterar animação, edite `loadAnimeFromCDN` ou substitua por animação local.
  - Para mudar o visual dos cards, atualize as classes `.card` e variáveis em `main.scss`.
-->

<template>
  <div class="home-root-container">
    <section class="hero glass center">
      <div class="hero-inner">
        <h1 class="title">Navegue pelo AURA</h1>
        <p>Selecione suas opções</p>
        <div class="hero-actions">
          <button class="btn" @click="goAnalysis">
            <Icon icon="tabler:sparkles" width="30" height="30" />
            Diagnóstico
          </button>
          <button class="btn" @click="focusSearch">
            <Icon icon="tabler:search" width="30" height="30" />
            Produtos
          </button>
        </div>
      </div>
    </section>

    <section class="social-feed">
      <div class="feed-header">
        <h2 class="feed-title">Feed da Comunidade</h2>
        <p class="feed-subtitle">Veja o que outras pessoas estão comentando sobre cuidados com a pele.</p>
      </div>
      
      <div class="feed-container">
        <article 
          v-for="post in posts" 
          :key="post.id"
          class="post-card"
        >
          <!-- Post Header -->
          <div class="post-header">
            <div class="avatar" :style="{ backgroundColor: post.avatarColor }">
              {{ post.avatar.charAt(0).toUpperCase() }}
            </div>
            <div class="user-info">
              <h4 class="username">{{ post.user }}</h4>
              <span class="timestamp">há pouco</span>
            </div>
          </div>

          <!-- Post Image (if exists) -->
          <div v-if="post.image" class="post-image-container">
            <img 
              :src="post.image" 
              :alt="post.user"
              class="post-image"
              @click="openImageModal(post)"
            />
          </div>

          <!-- Post Text -->
          <div class="post-text">
            <p>{{ post.text }}</p>
          </div>

          <!-- Post Interactions -->
          <div class="post-actions">
            <button 
              class="action-btn"
              :class="{ 'is-liked': isPostLiked(post.id) }"
              @click="toggleLike(post.id)"
              :title="isPostLiked(post.id) ? 'Descurtir' : 'Curtir'"
            >
              <Icon 
                :icon="isPostLiked(post.id) ? 'tabler:heart-filled' : 'tabler:heart'"
                width="18"
                height="18"
              />
              <span class="action-count">{{ post.likes }}</span>
            </button>
            
            <button 
              class="action-btn"
              @click="toggleComments(post.id)"
              :title="expandedPostId === post.id ? 'Ocultar comentários' : 'Mostrar comentários'"
            >
              <Icon icon="tabler:message-circle" width="18" height="18" />
              <span class="action-count">{{ post.comments.length }}</span>
            </button>
            
            <button 
              class="action-btn"
              :class="{ 'is-shared': sharedPostId === post.id }"
              @click="sharePost(post.id)"
              :title="sharedPostId === post.id ? 'Copiado!' : 'Compartilhar'"
            >
              <Icon :icon="sharedPostId === post.id ? 'tabler:check' : 'tabler:share-2'" width="18" height="18" />
              <span class="action-text">{{ sharedPostId === post.id ? 'Copiado!' : 'Compartilhar' }}</span>
            </button>
          </div>

          <!-- Comments Section -->
          <div v-if="expandedPostId === post.id" class="comments-section">
            <div class="comments-list">
              <div v-if="post.comments.length === 0" class="no-comments">
                Sem comentários ainda. Seja o primeiro!
              </div>
              <div v-for="(comment, idx) in post.comments" :key="idx" class="comment-item">
                <div class="comment-header">
                  <div class="comment-author">{{ comment.author }}</div>
                  <button 
                    v-if="comment.author === 'Você'"
                    class="delete-comment-btn"
                    @click="showDeleteConfirmation(post.id, comment.id)"
                    title="Deletar comentário"
                  >
                    <Icon icon="tabler:trash" width="14" height="14" />
                  </button>
                </div>
                <div class="comment-text">{{ comment.text }}</div>
              </div>
            </div>
            
            <div class="comment-input-area">
              <input 
                v-model="commentTexts[post.id]"
                type="text"
                placeholder="Adicione um comentário..."
                @keyup.enter="addComment(post.id)"
                class="comment-input"
              />
              <button 
                @click="addComment(post.id)"
                class="send-btn"
              >
                <Icon icon="tabler:send" width="16" height="16" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <transition name="fade">
      <div v-if="selectedPost" class="modal-overlay" @click.self="closeImageModal">
        <div class="modal-card">
          <button class="modal-close" @click="closeImageModal">
            <Icon icon="tabler:x" width="24" height="24" />
          </button>
          
          <img :src="selectedPost.image" :alt="selectedPost.user" class="modal-image" />
          
          <div class="modal-content">
            <div class="post-header">
              <div class="avatar" :style="{ backgroundColor: selectedPost.avatarColor }">
                {{ selectedPost.avatar.charAt(0).toUpperCase() }}
              </div>
              <div class="user-info">
                <h4 class="username">{{ selectedPost.user }}</h4>
                <span class="timestamp">há pouco</span>
              </div>
            </div>
            
            <p class="modal-text">{{ selectedPost.text }}</p>
            
            <div class="post-actions">
              <button 
                class="action-btn"
                :class="{ 'is-liked': isPostLiked(selectedPost.id) }"
                @click="toggleLike(selectedPost.id)"
                :title="isPostLiked(selectedPost.id) ? 'Descurtir' : 'Curtir'"
              >
                <Icon 
                  :icon="isPostLiked(selectedPost.id) ? 'tabler:heart-filled' : 'tabler:heart'"
                  width="18"
                  height="18"
                />
                <span class="action-count">{{ selectedPost.likes }}</span>
              </button>
              
              <button 
                class="action-btn"
                @click="toggleComments(selectedPost.id)"
                :title="expandedPostId === selectedPost.id ? 'Ocultar comentários' : 'Mostrar comentários'"
              >
                <Icon icon="tabler:message-circle" width="18" height="18" />
                <span class="action-count">{{ selectedPost.comments.length }}</span>
              </button>
              
              <button 
                class="action-btn"
                :class="{ 'is-shared': sharedPostId === selectedPost.id }"
                @click="sharePost(selectedPost.id)"
                :title="sharedPostId === selectedPost.id ? 'Copiado!' : 'Compartilhar'"
              >
                <Icon :icon="sharedPostId === selectedPost.id ? 'tabler:check' : 'tabler:share-2'" width="18" height="18" />
                <span class="action-text">{{ sharedPostId === selectedPost.id ? 'Copiado!' : 'Compartilhar' }}</span>
              </button>
            </div>

            <div v-if="expandedPostId === selectedPost.id" class="comments-section">
              <div class="comments-list">
                <div v-if="selectedPost.comments.length === 0" class="no-comments">
                  Sem comentários ainda. Seja o primeiro!
                </div>
                <div v-for="(comment, idx) in selectedPost.comments" :key="idx" class="comment-item">
                  <div class="comment-header">
                    <div class="comment-author">{{ comment.author }}</div>
                    <button 
                      v-if="comment.author === 'Você'"
                      class="delete-comment-btn"
                      @click="showDeleteConfirmation(selectedPost.id, comment.id)"
                      title="Deletar comentário"
                    >
                      <Icon icon="tabler:trash" width="14" height="14" />
                    </button>
                  </div>
                  <div class="comment-text">{{ comment.text }}</div>
                </div>
              </div>
              
              <div class="comment-input-area">
                <input 
                  v-model="commentTexts[selectedPost.id]"
                  type="text"
                  placeholder="Adicione um comentário..."
                  @keyup.enter="addComment(selectedPost.id)"
                  class="comment-input"
                />
                <button 
                  @click="addComment(selectedPost.id)"
                  class="send-btn"
                >
                  <Icon icon="tabler:send" width="16" height="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Comment Confirmation Modal -->
    <transition name="fade">
      <div v-if="commentToDelete" class="delete-confirm-overlay" @click.self="cancelDelete">
        <div class="delete-confirm-card">
          <div class="delete-confirm-header">
            <Icon icon="tabler:alert-circle" width="24" height="24" />
            <h3>Deletar Comentário?</h3>
          </div>
          
          <p class="delete-confirm-text">
            Tem certeza que deseja deletar este comentário? Esta ação não pode ser desfeita.
          </p>
          
          <div class="delete-confirm-actions">
            <button 
              class="cancel-btn"
              @click="cancelDelete"
            >
              Cancelar
            </button>
            <button 
              class="delete-btn"
              @click="deleteComment"
            >
              Deletar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";

const router = useRouter();

function goAnalysis() {
  router.push("/ai-analysis");
}
function focusSearch() {
  router.push("/search");
}

// Posts Social Feed
const posts = ref([
  {
    id: 1,
    user: "AURA Tips",
    avatar: "aura",
    avatarColor: "#2ea4ff",
    text: "O cuidado com a pele não é luxo, é necessidade! 💧 Comece sua rotina com um bom limpador facial. Qual é o seu produto favorito?",
    image: null,
    likes: 0,
    comments: [],
  },
  {
    id: 2,
    user: "Beleza Natural",
    avatar: "beleza",
    avatarColor: "#27ae60",
    text: "Ingredientes naturais transformam a sua pele! 🌿 Nós recomendamos sempre verificar a composição dos produtos. Menos é mais!",
    image: "https://www.counterculturestore.co.uk/cdn/shop/files/face.wizard_refills.jpg?v=1734601659&width=1445",
    likes: 504,
    comments: [
      { author: "Marina Silva", text: "Já testei esses ingredientes, realmente funcionam!" },
      { author: "João", text: "Qual é a marca recomendada?" },
    ],
  },
  {
    id: 3,
    user: "Dermalab",
    avatar: "dermalab",
    avatarColor: "#d695ff",
    text: "Protetor solar é o melhor investimento para sua pele! ☀️ Use diariamente, mesmo em dias nublados. Sua pele futura agradece!",
    image: null,
    likes: 123,
    comments: [
      { author: "Ana Costa", text: "Nunca esqueço de aplicar protetor solar!" },
      { author: "Pedro", text: "Qual protetor vocês recomendam?" },
      { author: "Carla", text: "FPS 50+ é o mínimo recomendado 😊" },
    ],
  },
  {
    id: 4,
    user: "Rotina Simples",
    avatar: "rotina",
    avatarColor: "#ff556b",
    text: "Menos produtos, mais consistência! 💪 A melhor rotina é aquela que você consegue manter todos os dias. Qualidade sobre quantidade!",
    image: "https://www.makeup.com/-/media/project/loreal/brand-sites/mdc/americas/us/articles/2019/09_september/05-born-to-glow/editors-try-nyx-born-to-glow-foundation-hero-mudc-090519.jpg",
    likes: 1520,
    comments: [
      { author: "Beatriz", text: "Adoro essa filosofia! Simples é melhor" },
      { author: "Lucas", text: "Quais pincéis você recomenda?" },
    ],
  },
  {
    id: 5,
    user: "Eco Beauty",
    avatar: "eco",
    avatarColor: "#7dffaa",
    text: "Sustentabilidade e beleza caminham juntas! 🌍 Escolha marcas conscientes e reutilizáveis. Você faz a diferença com suas escolhas!",
    image: null,
    likes: 203,
    comments: [
      { author: "Gabriela", text: "Muito importante essa consciência ambiental!" },
      { author: "Rafael", text: "Que marcas vocês recomendam?" },
      { author: "Natalia", text: "Estou começando a usar produtos sustentáveis também!" },
      { author: "Diego", text: "Excelente iniciativa 🌱" },
    ],
  },
]);

const selectedPost = ref(null);
const expandedPostId = ref(null);
const commentTexts = ref({});
const sharedPostId = ref(null);
const commentToDelete = ref(null); // { postId, commentId }

// Load likes and comments from localStorage
function loadPostsData() {
  try {
    const storedLikes = localStorage.getItem("aura_posts_likes");
    const storedComments = localStorage.getItem("aura_posts_comments");
    
    if (storedLikes) {
      const likes = JSON.parse(storedLikes);
      posts.value.forEach(post => {
        if (likes[post.id]) {
          post.likes = likes[post.id];
        }
      });
    }
    
    if (storedComments) {
      const comments = JSON.parse(storedComments);
      posts.value.forEach(post => {
        if (comments[post.id] && comments[post.id].length > 0) {
          // Merge: Keep placeholder comments and add stored ones
          const placeholderCount = post.comments.length;
          const storedCommentsList = comments[post.id];
          // Only use stored if it has more than placeholder
          if (storedCommentsList.length > placeholderCount) {
            post.comments = storedCommentsList;
          }
        }
      });
    }
    
    // Add unique IDs to comments if they don't have them
    posts.value.forEach(post => {
      post.comments = post.comments.map((comment, idx) => ({
        id: comment.id || `${post.id}-${idx}-${Date.now()}`,
        author: comment.author,
        text: comment.text,
      }));
    });
  } catch (err) {
    console.log("Erro ao carregar dados dos posts:", err);
  }
}

// Save likes to localStorage
function saveLikes() {
  const likesData = {};
  posts.value.forEach(post => {
    likesData[post.id] = post.likes;
  });
  localStorage.setItem("aura_posts_likes", JSON.stringify(likesData));
}

// Save comments to localStorage
function saveComments() {
  const commentsData = {};
  posts.value.forEach(post => {
    commentsData[post.id] = post.comments;
  });
  localStorage.setItem("aura_posts_comments", JSON.stringify(commentsData));
}

// Check if post is liked
function isPostLiked(postId) {
  const liked = localStorage.getItem(`aura_post_${postId}_liked`);
  return liked === "true";
}

// Toggle like status
function toggleLike(postId) {
  const isLiked = isPostLiked(postId);
  const post = posts.value.find(p => p.id === postId);
  
  if (post) {
    if (isLiked) {
      post.likes--;
      localStorage.removeItem(`aura_post_${postId}_liked`);
    } else {
      post.likes++;
      localStorage.setItem(`aura_post_${postId}_liked`, "true");
    }
    saveLikes();
  }
}

// Toggle comments visibility
function toggleComments(postId) {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null;
  } else {
    expandedPostId.value = postId;
  }
}

// Add comment to post
function addComment(postId) {
  const text = commentTexts.value[postId];
  if (!text || text.trim() === "") {
    toast.error("Comentário vazio!");
    return;
  }

  const post = posts.value.find(p => p.id === postId);
  if (post) {
    post.comments.push({
      author: "Você",
      text: text,
    });
    commentTexts.value[postId] = "";
    saveComments();
    toast.success("Comentário adicionado!");
  }
}

// Share post
function sharePost(postId) {
  const url = "https://aura-domain.vercel.app";
  navigator.clipboard.writeText(url);
  
  // Visual feedback
  sharedPostId.value = postId;
  toast.success("Link copiado para a área de transferência!");
  
  // Reset after 2 seconds
  setTimeout(() => {
    sharedPostId.value = null;
  }, 2000);
}

// Show delete confirmation
function showDeleteConfirmation(postId, commentId) {
  commentToDelete.value = { postId, commentId };
}

// Cancel delete
function cancelDelete() {
  commentToDelete.value = null;
}

// Delete comment
function deleteComment() {
  if (!commentToDelete.value) return;
  
  const { postId, commentId } = commentToDelete.value;
  const post = posts.value.find(p => p.id === postId);
  
  if (post) {
    post.comments = post.comments.filter(c => c.id !== commentId);
    saveComments();
    toast.success("Comentário removido!");
  }
  
  commentToDelete.value = null;
}

// Open image modal
function openImageModal(post) {
  if (post.image) {
    selectedPost.value = post;
  }
}

// Close image modal
function closeImageModal() {
  selectedPost.value = null;
}

onMounted(() => {
  loadPostsData();
});
</script>

<style scoped>

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  width: 14vw;
  height: 10vh;
  margin: 19px;
  padding: 0 12px;
  gap: 8px;
  border: 2px solid var(--color-sky);
  background: var(--panel-bg) !important;
}

.hero {
  padding: 60px 0;
  margin-top: 12vh;
  margin-right: 2vw;
  margin-left: 2vw;
}
.hero-inner {
  text-align: center;
}
.hero-inner h1 {
  font-size: 3rem;
  margin-bottom: 6px;
  font-weight: 700;
  text-shadow: var(--txt-hover);
}
.hero-inner p {
  font-size: 1.2rem;
  text-shadow: var(--txt-hover);
  margin-bottom: 16px;
  color: var(--muted);
}
.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Social Feed Styles */
.social-feed {
  margin-top: 48px;
  padding: 0 2vw 60px;
  width: 100%;
}

.feed-header {
  max-width: 760px;
  margin: 0 auto 40px;
  text-align: left;
  padding: 0 16px;
}

.feed-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--text);
}

.feed-subtitle {
  text-align: center;
  font-size: 0.95rem;
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.feed-container {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px;
}

.post-card {
  background: var(--bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.3s ease;
}

.post-card:hover {
  background: var(--panel-bg);
  border-color: var(--color-sky);
  box-shadow: 0 4px 12px var(--muted);
}

/* Post Header */
.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.username {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
}

.timestamp {
  font-size: 0.8rem;
  color: var(--muted);
}

/* Post Image */
.post-image-container {
  margin: 12px -20px 0;
  border-radius: 0;
  overflow: hidden;
  background: rgba(253, 3, 3, 0.05);
}

.post-image {
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: block;
}

.post-image:hover {
  transform: scale(1.02);
}

/* Post Text */
.post-text {
  margin: 12px 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text);
}

.post-text p {
  margin: 0;
}

/* Post Actions */
.post-actions {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
  margin-top: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.action-btn:hover {
  color: var(--color-sky);
}

.action-btn.is-liked {
  color: #ff3b30;
}

.action-btn.is-shared {
  color: var(--color-sky);
  background: rgba(46, 163, 255, 0.1);
}

.action-count,
.action-text {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Comments Section */
.comments-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  max-height: 240px;
  overflow-y: auto;
}

.comment-item {
  padding: 8px 12px;
  background: var(--panel-bg);
  border-radius: 6px;
  border-left: 2px solid var(--color-sky);
}

.comment-author {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-sky);
  margin-bottom: 2px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.delete-comment-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-comment-btn:hover {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.1);
}

.comment-text {
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.4;
  word-break: break-word;
}

.no-comments {
  text-align: center;
  color: var(--muted);
  font-size: 0.85rem;
  padding: 12px 0;
  margin: 0;
}

.comment-input-area {
  display: flex;
  gap: 8px;
  padding-top: 12px;
}

.comment-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  background: var(--glass-bg);
  color: var(--text);
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.comment-input::placeholder {
  color: var(--muted);
}

.comment-input:focus {
  outline: none;
  border-color: var(--color-sky);
  box-shadow: 0 0 8px rgba(46, 163, 255, 0.2);
}

.send-btn {
  padding: 8px 12px;
  border: 1px solid var(--color-sky);
  border-radius: 6px;
  background: var(--bg);
  color: var(--color-sky);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover {
  background: var(--color-sky);
  color: white;
}

/* Modal for Image */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  background: var(--bg);
  backdrop-filter: blur(12px) saturate(120%);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.6);
}

.modal-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  max-height: 400px;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text);
  margin: 0;
}

/* Delete Comment Confirmation Modal */
.delete-confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
}

.delete-confirm-card {
  width: 100%;
  max-width: 400px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px) saturate(120%);
}

.delete-confirm-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ff3b30;
}

.delete-confirm-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.delete-confirm-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--muted);
}

.delete-confirm-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn,
.delete-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: transparent;
  color: var(--text);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--color-sky);
  color: var(--color-sky);
}

.delete-btn {
  background: #ff3b30;
  color: white;
  border-color: #ff3b30;
}

.delete-btn:hover {
  background: #ff2413;
  border-color: #ff2413;
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .social-feed {
    margin-top: 32px;
    padding: 0 1vw 40px;
  }

  .feed-header {
    padding: 0 8px;
    margin-bottom: 28px;
  }

  .feed-title {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }

  .feed-subtitle {
    font-size: 0.9rem;
  }

  .feed-container {
    padding: 0 8px;
    gap: 12px;
  }

  .post-card {
    padding: 16px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .username {
    font-size: 0.9rem;
  }

  .timestamp {
    font-size: 0.75rem;
  }

  .post-text {
    font-size: 0.9rem;
  }

  .action-btn {
    font-size: 0.8rem;
    padding: 4px 0;
  }

  .modal-card {
    border-radius: 16px;
    max-width: 100%;
  }

  .modal-image {
    max-height: 300px;
  }

  .modal-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .social-feed {
    margin-top: 24px;
    padding: 0 0.5rem 30px;
  }

  .feed-header {
    padding: 0 4px;
    margin-bottom: 20px;
  }

  .feed-title {
    font-size: 1.3rem;
    margin-bottom: 4px;
  }

  .feed-subtitle {
    font-size: 0.85rem;
  }

  .feed-container {
    padding: 0 4px;
    gap: 10px;
  }

  .post-card {
    padding: 12px;
  }

  .post-image-container {
    margin: 8px -12px 0;
  }

  .post-image {
    max-height: 300px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .username {
    font-size: 0.85rem;
  }

  .post-text {
    font-size: 0.85rem;
    margin: 8px 0;
  }

  .post-actions {
    gap: 12px;
    margin-top: 8px;
    padding-top: 8px;
  }

  .action-btn {
    font-size: 0.75rem;
    padding: 4px 0;
  }

  .comments-list {
    gap: 6px;
    max-height: 200px;
  }

  .comment-item {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .comment-input {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  .send-btn {
    padding: 6px 10px;
  }

  .modal-card {
    border-radius: 12px;
    max-width: 100%;
  }

  .modal-image {
    max-height: 250px;
  }

  .modal-content {
    padding: 12px;
    gap: 10px;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    top: 8px;
    right: 8px;
  }
}
</style>
