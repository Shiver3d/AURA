<script setup>
// funções aq
</script>


<template>
    <section class="mr-i">

        <header class="mr-i-status-panel">
            <h2>Olá {{ c }}, bom lhe ver novamente.</h2>
            <h3>Seu Regime de Beleza Personalizado Está Pronto!</h3>
        </header>

       <aside class="mr-i-filters">
        <h3>otimizar recomendações</h3>
       </aside>

        <div class="mr-i-product-list">
            <h2>Produtos Recomendados</h2>
            <div class="product-grid">
                <div class="placeholder-card">Card de Produto 1</div>
                <div class="placeholder-card">Card de Produto 2</div>
                <div class="placeholder-card">Card de Produto 3</div>
            </div>
        </div>

    </section>
</template>


<style lang="scss" scoped>
  // 1. Defina uma variável SCSS de teste
  $primary-color: #d0e5fc; // Azul corporativo simulado

  .mr-i {
    // variável
    background-color: $primary-color; 
    padding: 20px;
    font-family: 'Roboto', sans-serif;
    }
</style>