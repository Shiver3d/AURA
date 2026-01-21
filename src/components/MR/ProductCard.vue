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
  padding: 16px;
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
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(46, 163, 255, 0.15);
    border-color: var(--color-sky);
    background: var(--glass-bg);

    .product-image {
      transform: scale(1.05);
    }
  }
}

.image-wrapper {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
  aspect-ratio: 4 / 3;
  background: rgba(0, 0, 0, 0.05);
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
  background: var(--accent-solid);
  color: var(--color-sky);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(46, 163, 255, 0.2);
  box-shadow: 0 4px 12px rgba(46, 163, 255, 0.1);
}

.score-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 215, 0, 0.15);
  color: #ffd700;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  font-size: 0.85rem;
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
  padding: 10px 0;
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
  gap: 8px;
  min-height: 24px;
}

.tag {
  font-size: 0.65rem;
  padding: 5px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
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
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
    border: 1px solid rgba(39, 174, 96, 0.3);

    &:hover {
      background: rgba(39, 174, 96, 0.2);
    }
  }

  &.blue {
    background: rgba(46, 163, 255, 0.1);
    color: var(--color-sky);
    border: 1px solid rgba(46, 163, 255, 0.25);

    &:hover {
      background: rgba(46, 163, 255, 0.18);
    }
  }

  &.purple {
    background: rgba(138, 43, 255, 0.1);
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
  padding-top: 12px;
  border-top: 1px solid var(--glass-border);
}

.price {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--color-sky);
  text-shadow: 0 0 12px rgba(46, 163, 255, 0.15);
  letter-spacing: -0.5px;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .product-card {
    padding: 12px;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .image-wrapper {
    margin-bottom: 12px;
  }

  .product-name {
    font-size: 1rem;
  }

  .product-description {
    font-size: 0.8rem;
  }

  .tags {
    gap: 6px;
  }

  .tag {
    font-size: 0.6rem;
    padding: 4px 8px;
  }

  .price {
    font-size: 1.15rem;
  }
}

@media (max-width: 480px) {
  .product-card {
    padding: 10px;
  }

  .image-wrapper {
    margin-bottom: 10px;
    aspect-ratio: 1 / 1;
  }

  .category-badge {
    top: 8px;
    right: 8px;
    padding: 5px 10px;
    font-size: 0.65rem;
  }

  .score-badge {
    bottom: 8px;
    left: 8px;
    padding: 5px 8px;
    font-size: 0.75rem;
  }

  .product-name {
    font-size: 0.95rem;
  }

  .product-description {
    font-size: 0.75rem;
  }

  .tags {
    gap: 5px;
  }

  .price {
    font-size: 1.1rem;
  }
}
</style>
