<template>
  <div class="product-card glass" @click="handleClick">
    <div class="image-wrapper">
      <img 
        :src="product.image_url || 'https://via.placeholder.com/300x300?text=Produto'" 
        :alt="product.name"
        class="product-image"
      />
      <span class="category-badge">{{ formatCategory(product.category) }}</span>
      <span v-if="product.rating" class="score-badge">
        ⭐ {{ product.rating.toFixed(1) }}
      </span>
    </div>
    
    <div class="card-content">
      <h4 class="product-name">{{ product.name }}</h4>
      
      <p v-if="product.description" class="product-description">
        {{ truncateText(product.description, 60) }}
      </p>
      
      <div class="product-meta">
        <span v-if="product.reviews_count" class="reviews-count">
          {{ product.reviews_count }} avaliações
        </span>
      </div>

      <div class="tags">
        <span v-if="product.rating > 4.5" class="tag green">
          <Icon icon="lucide:star" width="12" /> Top Rated
        </span>
        <span v-if="product.category === 'skincare'" class="tag blue">
          <Icon icon="lucide:droplets" width="12" /> Skincare
        </span>
        <span v-if="product.category === 'makeup'" class="tag purple">
          <Icon icon="lucide:palette" width="12" /> Makeup
        </span>
      </div>

      <div class="product-footer">
        <span v-if="product.price" class="price">
          R$ {{ formatPrice(product.price) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (obj) => obj.id && obj.name
  }
})

const formatCategory = (category) => {
  const categories = {
    skincare: 'Cuidados',
    makeup: 'Maquiagem',
    haircare: 'Cabelos',
    bodycare: 'Corpo',
    tools: 'Ferramentas'
  }
  return categories[category] || category
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2).replace('.', ',') : price
}

const handleClick = () => {
  emit('select', props.product)
}

const emit = defineEmits(['select'])
</script>

<style scoped lang="scss">
.product-card {
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--radius);
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--txt-hover);
    border-color: var(--color-sky);
    background: var(--glass-bg);

    .product-image {
      transform: scale(1.08);
    }
  }
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  aspect-ratio: 4 / 3;
  background: rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.category-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, var(--color-sky), #1a7fe0);
  color: var(--bg);
  padding: 5px 12px;
  border-radius: 18px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 229, 255, 0.3);
}

.score-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffd700;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 215, 0, 0.4);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.product-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  color: var(--muted);
  padding: 8px 0;
  border-top: 1px solid var(--glass-border);
  border-bottom: 1px solid var(--glass-border);
}

.reviews-count {
  font-weight: 500;
  font-size: 0.8rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 24px;
}

.tag {
  font-size: 0.65rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  color: var(--text);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: var(--color-sky);
  }

  &.green {
    background: var(--color-green);
    color: #27ae60;
    border: 1px solid rgba(39, 174, 96, 0.3);

    &:hover {
      background: rgba(39, 174, 96, 0.25);
    }
  }

  &.blue {
    background: rgba(0, 229, 255, 0.12);
    color: var(--color-sky);
    border: 1px solid rgba(0, 229, 255, 0.25);

    &:hover {
      background: rgba(0, 229, 255, 0.18);
    }
  }

  &.purple {
    background: rgba(138, 43, 255, 0.12);
    color: #bb86fc;
    border: 1px solid rgba(138, 43, 255, 0.3);

    &:hover {
      background: rgba(138, 43, 255, 0.2);
    }
  }
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--glass-border);
}

.price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-sky);
  text-shadow: var(--txt-hover);
  letter-spacing: -0.5px;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .product-card {
    padding: 10px;

    &:hover {
      transform: translateY(-6px);
    }
  }

  .image-wrapper {
    margin-bottom: 12px;
  }

  .product-name {
    font-size: 0.95rem;
  }

  .product-description {
    font-size: 0.75rem;
  }

  .tags {
    gap: 4px;
  }

  .tag {
    font-size: 0.6rem;
    padding: 3px 6px;
  }

  .price {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .product-card {
    padding: 8px;
  }

  .image-wrapper {
    margin-bottom: 10px;
    aspect-ratio: 1 / 1;
  }

  .category-badge {
    top: 6px;
    right: 6px;
    padding: 4px 8px;
    font-size: 0.65rem;
  }

  .score-badge {
    bottom: 6px;
    left: 6px;
    padding: 4px 8px;
    font-size: 0.7rem;
  }

  .product-name {
    font-size: 0.9rem;
  }

  .tags {
    gap: 3px;
  }

  .price {
    font-size: 1rem;
  }
}
</style>
