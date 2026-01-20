<template>
  <div class="about-root container">
    <header class="page-header glass">
      <h1>Sobre AURA</h1>
      <p>Conhece a ideia que revoluciona as recomendações de produtos de beleza</p>
    </header>

    <main class="about-content">
      <section class="content-section glass">
        <h2>O Que é AURA?</h2>
        <p>
          AURA é um hub inovador de recomendação de produtos de cosméticos que preenche uma lacuna importante 
          que percebi no mercado. Não é apenas um catálogo de produtos — é um ecossistema onde pessoas podem 
          descobrir os melhores produtos para sua rotina de cuidados, interagir através de reviews, e ter 
          toda sua jornada de beleza em um único lugar.
        </p>
        <p>
          A visão é criar uma plataforma comunitária onde a beleza é personalizada, acessível e colaborativa.
        </p>
      </section>

      <section class="content-section glass">
        <h2>Como Foi Desenvolvido</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <Icon icon="lucide:code" width="32" />
            <h3>Frontend</h3>
            <p><strong>Vue 3</strong> com Composition API</p>
            <p>Construído com a última versão do Vue para reatividade máxima</p>
          </div>

          <div class="tech-item">
            <Icon icon="lucide:palette" width="32" />
            <h3>Estilo</h3>
            <p><strong>SCSS</strong> com variáveis globais</p>
            <p>Glassmorphism design seguindo Frutiger Aero aesthetics</p>
          </div>

          <div class="tech-item">
            <Icon icon="lucide:server" width="32" />
            <h3>Backend</h3>
            <p><strong>Supabase</strong> (PostgreSQL + Auth)</p>
            <p>Banco de dados em tempo real com autenticação segura</p>
          </div>

          <div class="tech-item">
            <Icon icon="lucide:package" width="32" />
            <h3>Tooling</h3>
            <p><strong>Vite</strong> + <strong>VS Code</strong></p>
            <p>Build rápido e dev experience moderno</p>
          </div>

          <div class="tech-item">
            <Icon icon="lucide:circle" width="32" />
            <h3>Ícones</h3>
            <p><strong>Iconify Vue</strong></p>
            <p>10M+ ícones de múltiplas bibliotecas</p>
          </div>

          <div class="tech-item">
            <Icon icon="lucide:bell" width="32" />
            <h3>Notificações</h3>
            <p><strong>Vue Sonner</strong></p>
            <p>Toast notifications elegantes e fluidas</p>
          </div>
        </div>
      </section>

      <section class="content-section glass">
        <h2>Recursos Principais</h2>
        <ul class="features-list">
          <li>
            <Icon icon="lucide:sparkles" />
            <span><strong>Módulo de Recomendação Inteligente:</strong> Descubra produtos personalizados baseado no seu perfil</span>
          </li>
          <li>
            <Icon icon="lucide:search" />
            <span><strong>Sistema de Busca:</strong> Busque produtos por nome, categoria ou descrição em tempo real</span>
          </li>
          <li>
            <Icon icon="lucide:user" />
            <span><strong>Perfil de Usuário:</strong> Gerencie suas preferências e histórico de buscas</span>
          </li>
          <li>
            <Icon icon="lucide:message-circle" />
            <span><strong>Reviews e Ratings:</strong> Compartilhe sua opinião e leia avaliações de outros usuários</span>
          </li>
          <li>
            <Icon icon="lucide:heart" />
            <span><strong>Preferências Personalizadas:</strong> Filtros por sustentabilidade, inclusividade e mais</span>
          </li>
          <li>
            <Icon icon="lucide:lock" />
            <span><strong>Segurança e Privacidade:</strong> Seus dados são protegidos e nunca serão vendidos</span>
          </li>
        </ul>
      </section>

      <section class="content-section glass vision-section">
        <h2>Visão Futura</h2>
        <p>
          Minha ambição é ver AURA crescer como uma rede social própria de recomendações de beleza, 
          onde usuários têm total controle e personalização de sua experiência. Gostaria de expandir para:
        </p>
        <ul class="vision-list">
          <li>🔮 Chat com IA para análise de rotina em tempo real</li>
          <li>📸 Análise de foto para recomendações automáticas baseado em seu tipo de pele</li>
          <li>💬 Comunidade ativa com creators de beleza</li>
          <li>🛒 Integração com e-commerces para compra direta</li>
          <li>📱 Aplicativo mobile nativo</li>
          <li>🌐 Redes sociais integradas para compartilhamento viral</li>
        </ul>
        <p class="vision-paragraph">
          A beleza merece um espaço próprio online, onde todos tem voz e controle total.
        </p>
      </section>

      <section class="content-section glass">
        <h2>Quer Contribuir?</h2>
        <p>
          Se você tem sugestões, encontrou um bug, ou quer colaborar no desenvolvimento,
          <RouterLink to="/contact-to-shiver3d" class="contact-link">entre em contato comigo</RouterLink>.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";
</script>

<style scoped lang="scss">
.about-root {
  margin-top: 10vh;
  min-height: 85vh;
  padding-bottom: 120px;
}

.page-header {
  padding: 48px 32px;
  text-align: center;
  margin-bottom: 40px;
  border-radius: var(--radius);

  h1 {
    margin: 0;
    font-size: 3rem;
    font-weight: 600;
    text-shadow: var(--txt-hover);
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    color: var(--muted);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    text-shadow: var(--txt-hover);
  }
}

.vision-paragraph {
  margin-top: 16px;
  font-style: italic;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content-section {
  padding: 32px;
  border-radius: var(--radius);
  backdrop-filter: blur(10px);

  h2 {
    margin: 0 0 24px 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  p {
    margin: 0 0 16px 0;
    color: var(--muted);
    line-height: 1.8;
    font-size: 1.05rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.tech-item {
  padding: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-sky);
    transform: translateY(-4px);
    box-shadow: var(--accent-solid);
  }

  svg {
    color: var(--color-sky);
    margin-bottom: 12px;
  }

  h3 {
    margin: 12px 0 8px 0;
    font-size: 1.1rem;
    color: var(--text);
  }

  p {
    margin: 8px 0;
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.6;

    strong {
      color: var(--text);
    }
  }
}

.features-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--color-sky);
      background: var(--btn-hover);
    }

    svg {
      width: 24px;
      height: 24px;
      color: var(--color-sky);
      margin-top: 2px;
      flex-shrink: 0;
    }

    span {
      color: var(--muted);
      line-height: 1.6;

      strong {
        color: var(--text);
      }
    }
  }
}

.vision-section {
  ul {
    list-style: none;
    margin: 20px 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      padding: 12px 16px;
      background: var(--glass-bg);
      border-left: 3px solid var(--color-sky);
      border-radius: 8px;
      color: var(--muted);
      font-size: 1.05rem;
      line-height: 1.6;
    }
  }
}

.contact-link {
  color: var(--color-sky);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    text-decoration: underline;
    text-shadow: var(--txt-hover);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-root {
    margin-top: 8vh;
    padding-left: 16px;
    padding-right: 16px;
  }

  .page-header {
    padding: 32px 24px;

    h1 {
      font-size: 3rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .content-section {
    padding: 24px;

    h2 {
      font-size: 1.5rem;
    }
  }

  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .about-root {
    margin-top: 6vh;
    padding-left: 12px;
    padding-right: 12px;
  }

  .page-header {
    padding: 24px 16px;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 0.95rem;
    }
  }

  .content-section {
    padding: 16px;

    h2 {
      font-size: 1.2rem;
    }
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .features-list li {
    padding: 12px;
    gap: 12px;
  }
}
</style>
