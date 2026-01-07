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
</style>
