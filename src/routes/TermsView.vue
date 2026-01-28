<template>
  <div class="terms-root container">
    <header class="page-header glass">
      <h1>Privacidade & Dados</h1>
      <p>Entenda como seus dados são protegidos e utilizados em AURA</p>
    </header>

    <main class="terms-content">
      <section class="faq-section glass">
        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(0)">
            <span>Quais dados você coleta de mim?</span>
            <Icon icon="lucide:chevron-down" :class="{ open: activeFaq === 0 }" />
          </button>
          <div v-show="activeFaq === 0" class="faq-answer">
            <p>
              Coletamos apenas informações essenciais para o funcionamento do serviço:
            </p>
            <ul>
              <li><strong>Email:</strong> Usado exclusivamente para login e notificações de conta (bem-vindo, recuperação de senha)</li>
              <li><strong>Nome Completo:</strong> Armazenado apenas em seu perfil, nunca compartilhado publicamente</li>
              <li><strong>Histórico de Busca:</strong> Armazenado localmente para melhorar recomendações</li>
              <li><strong>Preferências:</strong> Filtros de sustentabilidade e inclusividade que você seleciona</li>
            </ul>
            <p style="margin-top: 16px; font-weight: 600; color: var(--color-sky);">
              ⚠️ IMPORTANTE: Nunca armazenamos suas senhas em texto plano — usamos autenticação segura do Supabase
            </p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(1)">
            <span>Meus dados serão vendidos a terceiros?</span>
            <Icon icon="lucide:chevron-down" :class="{ open: activeFaq === 1 }" />
          </button>
          <div v-show="activeFaq === 1" class="faq-answer">
            <p>
              <strong>Absolutamente não.</strong> 
            </p>
            <p>
              Seus dados são seus. Eu não possuo acesso direto às suas senhas, 
              não vendo suas informações a anunciantes, e não as compartilho com terceiros. 
              AURA é construído com privacidade em primeiro lugar.
            </p>
            <p>
              A única exceção é se você voluntariamente compartilhar um review ou comentário público na comunidade,
              que será visível a outros usuários por sua escolha.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(2)">
            <span>Que tipos de emails são enviados?</span>
            <Icon icon="lucide:chevron-down" :class="{ open: activeFaq === 2 }" />
          </button>
          <div v-show="activeFaq === 2" class="faq-answer">
            <p>
              Você receberá apenas emails transacionais necessários:
            </p>
            <ul>
              <li><strong>Boas-vindas:</strong> Ao criar sua conta</li>
              <li><strong>Recuperação de Senha:</strong> Quando você solicitar mudança de senha.</li>
              <li><strong>Confirmação de Email:</strong> Para verificar endereço de email.</li>
              <li><strong>Mudança de Conta:</strong> Se alterar informações sensíveis.</li>
            </ul>
            <p style="margin-top: 16px;">
              ❌ <strong>O que o time do AURA <span class="not">NÃO</span> faz:</strong> Não enviamos spam, newsletters não solicitadas, 
              ou promoções de terceiros.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question" @click="toggleFaq(3)">
            <span>Como são deletados meus dados se sair?</span>
            <Icon icon="lucide:chevron-down" :class="{ open: activeFaq === 3 }" />
          </button>
          <div v-show="activeFaq === 3" class="faq-answer">
            <p>
              Você tem direito total sobre seus dados, todavia, peço atenção aos seguintes pontos:
            </p>
            <ul>
              <li><strong>Deletar Conta:</strong> Pode deletar sua conta a qualquer momento. Por ser um teste experimental de funcionalidades constantemente estou refatorando a base de dados, pode ser que algum momento seus dados sejam excluídos.</li>
              <li><strong>Apagar Dados:</strong> Histórico de busca, preferências e nome serão completamente removidos junto ao acesso.</li>
              <li><strong>Quero deletar minha conta. Como?</strong> Se quiser me notificar sobre exclusão, entre em contato comigo diretamente.</li>
            </ul>
            <p style="margin-top: 16px;">
              Reviews públicos que você postou permanecerão (anônimos, contabilizando somente estrelas), pois contribuem para a comunidade,
              mas sua identidade será desassociada.
            </p>
          </div>
        </div>
      </section>

      <section class="info-section glass">
        <h2>Segurança</h2>
        <div class="security-grid">
          <div class="security-item">
            <Icon icon="lucide:lock" />
            <h3>Criptografia</h3>
            <p>Seus dados são criptografados com SSL/TLS, o padrão de segurança da internet.</p>
          </div>
          <div class="security-item">
            <Icon icon="lucide:shield" />
            <h3>Autenticação Segura</h3>
            <p>Sua conta é protegida com senhas criptografadas e autenticação segura.</p>
          </div>
          <div class="security-item">
            <Icon icon="lucide:alert-circle" />
            <h3>Privacidade</h3>
            <p>Seus dados são privados e nunca são compartilhados sem sua autorização.</p>
          </div>
        </div>
      </section>

      <section class="contact-section glass">
        <h2>Dúvidas sobre Privacidade?</h2>
        <p>
          Se tiver qualquer preocupação sobre como seus dados são tratados,
          <RouterLink to="/contact-to-shiver3d" class="contact-link">entre em contato comigo diretamente</RouterLink>.
        </p>
        <p style="margin-top: 16px; font-size: 0.9rem; color: var(--muted);">
          Última atualização: {{ lastUpdated }}
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";

const activeFaq = ref(null);
const lastUpdated = new Date().toLocaleDateString("pt-BR");

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};
</script>

<style scoped lang="scss">
.terms-root {
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
    margin-bottom: 16px;
    text-shadow: var(--txt-hover);
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

.terms-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.faq-section {
  padding: 32px;
  border-radius: var(--radius);
}

.faq-item {
  border-bottom: 1px solid var(--glass-border);

  &:last-child {
    border-bottom: none;
  }

  &:not(:first-child) {
    margin-top: 16px;
    padding-top: 16px;
  }
}

.not {
    color: rgb(224, 84, 84);
    text-decoration: underline;
    text-decoration-color: var(--accent-solid);
}


.faq-question {
  width: 100%;
  padding: 20px;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.3s ease;
  margin: 0;

  &:hover {
    color: var(--color-sky);
  }

  svg {
    width: 24px;
    height: 24px;
    transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);
    color: var(--muted);

    &.open {
      transform: rotate(180deg);
    }
  }
}

.faq-answer {
  padding: 0 20px 20px 20px;
  color: var(--muted);
  line-height: 1.8;
  animation: slideDown 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);

  p {
    margin: 0 0 16px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    margin: 16px 0;
    padding-left: 24px;
    list-style: none;

    li {
      margin: 12px 0;
      padding-left: 8px;
      border-left: 2px solid var(--color-sky);
      padding-left: 16px;
      color: var(--muted);

      strong {
        color: var(--text);
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-section {
  padding: 32px;
  border-radius: var(--radius);

  h2 {
    margin: 0 0 24px 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
  }
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.security-item {
  padding: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-sky);
    transform: translateY(-4px);
  }

  svg {
    width: 32px;
    height: 32px;
    color: var(--color-sky);
    margin-bottom: 12px;
  }

  h3 {
    margin: 12px 0 8px 0;
    color: var(--text);
    font-size: 1.05rem;
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.6;
  }
}

.contact-section {
  padding: 32px;
  border-radius: var(--radius);
  text-align: center;

  h2 {
    margin: 0 0 20px 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.8;
  }
}

.contact-link {
  color: var(--txt-hover);
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
  .terms-root {
    margin-top: 8vh;
    padding-left: 16px;
    padding-right: 16px;
  }

  .page-header {
    padding: 32px 24px;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .faq-section,
  .info-section,
  .contact-section {
    padding: 24px;
  }

  .faq-question {
    padding: 16px;
  }

  .security-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .terms-root {
    margin-top: 6vh;
    padding-left: 12px;
    padding-right: 12px;
  }

  .page-header {
    padding: 24px 16px;

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.95rem;
    }
  }

  .faq-section,
  .info-section,
  .contact-section {
    padding: 16px;
  }

  .faq-question {
    padding: 12px;
    font-size: 1rem;
  }

  .security-grid {
    grid-template-columns: 1fr;
  }
}
</style>
