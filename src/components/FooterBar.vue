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
  left: clamp(8px, 2vw, 16px);
  right: clamp(8px, 2vw, 16px);
  bottom: clamp(8px, 2vw, 16px);
  padding: clamp(8px, 1.5vw, 14px);
  display: flex;
  justify-content: center;
  z-index: 30;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.footer.hidden {
  opacity: 0;
  pointer-events: none;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  color: var(--muted);
  font-size: clamp(11px, 1.5vw, 14px);
  align-items: center;
}

.links {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 16px);
}

.footer-link {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  font-size: clamp(11px, 1.5vw, 13px);

  &:hover {
    color: var(--text);
    text-decoration: underline;
  }
}

.separator {
  opacity: 0.5;
  font-size: clamp(10px, 1.5vw, 13px);
}

/* Responsive Design for Tablet (768px) */
@media (max-width: 768px) {
  .footer {
    left: clamp(6px, 1.5vw, 12px);
    right: clamp(6px, 1.5vw, 12px);
    bottom: clamp(60px, 15vh, 90px);
    padding: clamp(6px, 1.5vw, 10px);
  }

  .footer-inner {
    flex-direction: column;
    gap: clamp(14px, 3vw, 24px);
    text-align: center;
    font-size: clamp(13px, 2vw, 16px);
  }
  
  .links {
    font-size: clamp(11px, 1.5vw, 14px);
    gap: clamp(40px, 8vw, 70px);
  }
}

/* Responsive Design for Mobile (480px) */
@media (max-width: 480px) {
  .footer {
    left: clamp(2px, 1vw, 6px);
    right: clamp(2px, 1vw, 6px);
    bottom: clamp(12vh, 14vh, 18vh);
    padding: clamp(4px, 1vw, 8px);
  }
  
  .footer-inner {
    flex-direction: column;
    gap: clamp(2px, 0.5vw, 8px);
    text-align: center;
    font-size: clamp(14px, 2.5vw, 16px);
  }
  
  .links {
    font-size: clamp(9px, 1.5vw, 12px);
    gap: clamp(12px, 2vw, 24px);
  }
}
</style>
