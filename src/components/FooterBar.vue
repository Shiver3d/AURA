<!--
  Arquivo: src/components/FooterBar.vue
  Descrição: Rodapé fixo com links navegáveis e lógica de hide/show ao scrollar (em AI-Analysis).
-->

<template>
  <footer 
    class="footer glass" 
    :class="{ hidden: hideFooter }"
  >
    <div class="container footer-inner">
      <div class="Trademark">© AURA — 2025</div>
      <div class="links">
        <RouterLink to="/about" class="footer-link">Sobre</RouterLink>
        <span class="separator">•</span>
        <RouterLink to="/terms" class="footer-link">Termos</RouterLink>
        <span class="separator">•</span>
        <RouterLink to="/contact-to-shiver3d" class="footer-link">Contato</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";

const route = useRoute();
const hideFooter = ref(false);
let lastScrollY = 0;

const handleScroll = () => {
  // Só aplica hide/show em AI-Analysis
  if (route.name !== "ai-analysis") {
    hideFooter.value = false;
    return;
  }

  const scrollY = window.scrollY;
  
  // Se scrollou pra baixo mais de 100px e está descendo, esconde
  if (scrollY > lastScrollY && scrollY > 100) {
    hideFooter.value = true;
  } 
  // Se voltou a subir, mostra
  else if (scrollY < lastScrollY) {
    hideFooter.value = false;
  }
  
  lastScrollY = scrollY;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.footer {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: 12px;
  padding: 10px 14px;
  display: flex;
  justify-content: center;
  z-index: 30;
  transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), 
              opacity 0.4s ease;
  opacity: 1;
  transform: translateY(0);
}

.footer.hidden {
  transform: translateY(120px);
  opacity: 0;
  pointer-events: none;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  color: var(--muted);
  font-size: 13px;
  align-items: center;
}

.links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-link {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: var(--text);
    text-decoration: underline;
  }
}

.separator {
  opacity: 0.5;
}

/* Responsive Design for Tablet (768px) */
@media (max-width: 768px) {
  .footer {
    left: 8px;
    right: 8px;
    bottom: 80px;
    padding: 8px 10px;
  }

  .footer-inner {
    flex-direction: column;
    gap: 18px;
    text-align: center;
    font-size: medium;
  }
  .links {
    font-size: small;
    gap: 60px;
  }
}

/* Responsive Design for Mobile (480px) */
@media (max-width: 480px) {
  .footer {
    left: 4px;
    right: 4px;
    bottom: 14vh;
    padding: 6px 8px;
  }
  .footer-inner {
    flex-direction: column;
    gap: 4px;
    text-align: center;
    font-size: 1rem;
  }
  .links {
    font-size: 10px;
    gap: 18px;
    font-size: small;
  }
}
</style>
