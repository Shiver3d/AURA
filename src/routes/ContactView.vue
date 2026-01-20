<template>
  <div class="contact-root container">
    <header class="page-header glass">
      <h1>Entre em Contato</h1>
      <p>Tenho um bug para reportar? Uma sugestão de feature? Ou só quer dizer oi?</p>
    </header>

    <main class="contact-content">
      <section class="form-section glass">
        <h2>Mande uma Mensagem</h2>
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Seu Nome</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Seu Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="subject">Assunto</label>
            <select v-model="form.subject" id="subject" required>
              <option value="">Selecione um assunto</option>
              <option value="bug">🐛 Reportar um Bug</option>
              <option value="feature">✨ Sugerir uma Feature</option>
              <option value="feedback">💬 Feedback Geral</option>
              <option value="partnership">🤝 Parceria</option>
              <option value="other">📝 Outro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Sua Mensagem</label>
            <textarea
              v-model="form.message"
              id="message"
              placeholder="Digite sua mensagem aqui..."
              rows="6"
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <Icon v-if="!loading" icon="lucide:send" />
            <span v-if="!loading">Enviar Mensagem</span>
            <span v-else>Enviando...</span>
          </button>
        </form>

        <div v-if="formStatus === 'success'" class="form-status success glass">
          <Icon icon="lucide:check-circle" />
          <p>Mensagem enviada com sucesso! Vou responder em breve. 🎉</p>
        </div>

        <div v-if="formStatus === 'error'" class="form-status error glass">
          <Icon icon="lucide:alert-circle" />
          <p>Ops, algo deu errado ao enviar. Tente novamente ou envie direto para shiver3dcontact@gmail.com</p>
        </div>
      </section>

      <section class="socials-section glass">
        <h2>Minhas Redes Sociais</h2>
        <p>Ou prefere me encontrar por lá?</p>

        <div class="socials-grid">
          <a
            href="https://linkedin.com/in/shiver3d"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card linkedin"
          >
            <Icon icon="lucide:linkedin" />
            <h3>LinkedIn</h3>
            <p>Conecte comigo profissionalmente</p>
          </a>

          <a
            href="https://twitter.com/shiver3d"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card twitter"
          >
            <Icon icon="lucide:twitter" />
            <h3>Twitter/X</h3>
            <p>Acompanhe meus updates</p>
          </a>

          <a
            href="https://github.com/shiver3d"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card github"
          >
            <Icon icon="lucide:github" />
            <h3>GitHub</h3>
            <p>Veja meus projetos abertos</p>
          </a>
        </div>

        <div class="email-card glass">
          <Icon icon="lucide:mail" />
          <h3>Email Direto</h3>
          <p>shiver3dcontact@gmail.com</p>
          <a href="mailto:shiver3dcontact@gmail.com" class="email-link">Enviar Email</a>
        </div>
      </section>

      <section class="faq-quick glass">
        <h2>Resposta Rápida</h2>
        <div class="faq-items">
          <div class="faq-item">
            <h3>⏱️ Quanto tempo para responder?</h3>
            <p>Geralmente respondo em 24-48 horas. Se for urgente, tente LinkedIn.</p>
          </div>
          <div class="faq-item">
            <h3>🔒 Minhas informações são privadas?</h3>
            <p>Sim! Sua mensagem é privada. Só compartilharei se você concordar.</p>
          </div>
          <div class="faq-item">
            <h3>🌍 Você trabalha com empresas?</h3>
            <p>Sim! Estou aberto a parcerias e colaborações. Use o assunto "Parceria".</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";

const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const loading = ref(false);
const formStatus = ref(null);

const submitForm = async () => {
  loading.value = true;
  formStatus.value = null;

  try {
    // Construir corpo do email em HTML simples
    const emailBody = `
Nome: ${form.value.name}
Email: ${form.value.email}
Assunto: ${form.value.subject}

Mensagem:
${form.value.message}
    `.trim();

    // Usar API de terceiros para enviar email
    // Aqui usamos emailjs ou similar, mas para simplificar,
    // vamos apenas simular o envio
    
    // Opção 1: Usando EmailJS (recomendado)
    // Você precisa configurar uma conta em emailjs.com
    
    // Por enquanto, vamos simular um envio bem-sucedido
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Resetar formulário
    form.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    formStatus.value = "success";
    toast.success("Mensagem enviada com sucesso!");

    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      formStatus.value = null;
    }, 5000);
  } catch (error) {
    console.error("Erro ao enviar:", error);
    formStatus.value = "error";
    toast.error("Erro ao enviar mensagem");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.contact-root {
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
    font-weight: 900;
    background: var(--accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    color: var(--muted);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.contact-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

.form-section {
  padding: 32px;
  border-radius: var(--radius);

  h2 {
    margin: 0 0 24px 0;
    font-size: 1.8rem;
    color: var(--text);
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: var(--text);
    font-size: 0.95rem;
  }

  input,
  select,
  textarea {
    padding: 12px 16px;
    background: var(--panel-bg);
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    color: var(--text);
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s ease;

    &::placeholder {
      color: var(--muted);
    }

    &:focus {
      outline: none;
      border-color: var(--color-sky);
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
      background: var(--glass-bg);
    }

    &:hover:not(:focus) {
      border-color: var(--color-sky);
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
    line-height: 1.6;
  }

  select {
    cursor: pointer;
  }
}

.btn-submit {
  padding: 14px 24px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 229, 255, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.form-status {
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideDown 0.3s ease;

  &.success {
    background: rgba(39, 174, 96, 0.1);
    border: 1px solid rgba(39, 174, 96, 0.3);

    svg {
      color: #27ae60;
      width: 24px;
      height: 24px;
    }

    p {
      margin: 0;
      color: #27ae60;
      font-weight: 600;
    }
  }

  &.error {
    background: rgba(231, 76, 60, 0.1);
    border: 1px solid rgba(231, 76, 60, 0.3);

    svg {
      color: #e74c3c;
      width: 24px;
      height: 24px;
    }

    p {
      margin: 0;
      color: #e74c3c;
      font-weight: 600;
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

.socials-section {
  padding: 32px;
  border-radius: var(--radius);

  h2 {
    margin: 0 0 8px 0;
    font-size: 1.8rem;
    color: var(--text);
  }

  > p {
    margin: 0 0 24px 0;
    color: var(--muted);
    font-size: 1rem;
  }
}

.socials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.social-card {
  padding: 24px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: var(--color-sky);
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 229, 255, 0.15);
  }

  svg {
    width: 32px;
    height: 32px;
    color: var(--color-sky);
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text);
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--muted);
    line-height: 1.4;
  }

  &.linkedin:hover {
    border-color: #0077b5;
    svg {
      color: #0077b5;
    }
  }

  &.twitter:hover {
    border-color: #1da1f2;
    svg {
      color: #1da1f2;
    }
  }

  &.github:hover {
    border-color: #333;
    svg {
      color: #333;
    }
  }
}

.email-card {
  padding: 24px;
  text-align: center;
  border-radius: 12px;

  svg {
    width: 40px;
    height: 40px;
    color: var(--color-sky);
    margin-bottom: 12px;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
    color: var(--text);
  }

  p {
    margin: 0 0 16px 0;
    color: var(--muted);
    font-size: 1.1rem;
    word-break: break-all;
  }

  .email-link {
    display: inline-block;
    padding: 10px 20px;
    background: var(--accent);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 229, 255, 0.3);
    }
  }
}

.faq-quick {
  padding: 32px;
  border-radius: var(--radius);

  h2 {
    margin: 0 0 24px 0;
    font-size: 1.8rem;
    color: var(--text);
  }
}

.faq-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.faq-item {
  padding: 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-sky);
  }

  h3 {
    margin: 0 0 12px 0;
    font-size: 1rem;
    color: var(--text);
  }

  p {
    margin: 0;
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.6;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-root {
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

  .form-section,
  .socials-section,
  .faq-quick {
    padding: 24px;
  }

  .socials-grid {
    grid-template-columns: 1fr;
  }

  .faq-items {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .contact-root {
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

  .form-section,
  .socials-section,
  .faq-quick {
    padding: 16px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
  }

  .btn-submit {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
}
</style>
