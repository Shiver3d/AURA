<!--
  Arquivo: src/components/FooterBar.vue
  Descrição: Rodapé fixo simples com informações da aplicação.
  - Mantém links estáticos e copyright.
  - Estilos são scoped para posicionamento e tipografia.

  Como modificar:
  - Atualize o texto/links dentro do template conforme necessário.
-->

<template>
  <footer class="footer glass">
    <div class="container footer-inner">
      <div>© AURA — 2025</div>
      <div class="links">Sobre • Termos • Contato</div>
    </div>
  </footer>
</template>

<script setup></script>

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
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  color: var(--muted);
  font-size: 13px;
}

/* Responsive Design for Tablet (768px) */
@media (max-width: 768px) {
  .footer {
    left: 8px;
    right: 8px;
    bottom: 8px;
    padding: 8px 10px;
  }
  .footer-inner {
    flex-direction: column;
    gap: 6px;
    text-align: center;
    font-size: 12px;
  }
}

/* Responsive Design for Mobile (480px) */
@media (max-width: 480px) {
  .footer {
    left: 4px;
    right: 4px;
    bottom: 4px;
    padding: 6px 8px;
  }
  .footer-inner {
    flex-direction: column;
    gap: 4px;
    text-align: center;
    font-size: 11px;
  }
  .links {
    font-size: 10px;
  }
}
</style>
