# 🌟 AURA - Hub de Recomendação de Cosméticos

> Um ecossistema inovador onde pessoas descobrem produtos de beleza personalizados, compartilham experiências e constroem uma comunidade colaborativa.

![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![SCSS](https://img.shields.io/badge/SCSS-Responsive-CC6699?style=flat-square&logo=sass)

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Recursos Principais](#recursos-principais)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Desenvolvimento](#desenvolvimento)
- [Contato](#contato)

---

## 🎯 Visão Geral

**AURA** é um hub inovador de recomendação de produtos de cosméticos que cria um ecossistema completo onde:

✨ **Pessoas descobrem** produtos personalizados baseado em seu perfil e preferências  
🔍 **Buscam e filtram** produtos por categoria, ingredientes e características  
💬 **Compartilham avaliações** e constroem uma comunidade ativa  
🤖 **Recebem recomendações inteligentes** via módulo de IA  
👥 **Gerenciam perfil** e histórico de buscas  

A visão é criar uma plataforma comunitária onde a beleza é **personalizada, acessível e colaborativa**. A ideia surgiu ao acessar um dos sites da empresa L'oreal e perceber que existe uma lacuna, específicamente de **acessibilidade**, portanto, criei o hub para por minhas ideias em prática

---

## ✨ Recursos Principais

### 🎨 Análise Inteligente (AI Analysis)
- Módulo de recomendação alimentado por IA
- Análise de tipo de pele e rotina de cuidados
- Sugestões personalizadas em tempo real
- Interface intuitiva e responsiva

### 🔍 Sistema de Busca Avançado
- Busca por nome, categoria ou descrição
- Filtros dinâmicos
- Resultados em tempo real
- Navegação intuitiva

### 👤 Perfil de Usuário Completo
- Gerenciamento de preferências pessoais
- Avatar customizável
- Informações de rotina de cuidados
- Histórico de atividades

### 💬 Feed Comunitário
- Posts sobre cuidados com pele
- Sistema de likes e comentários
- Compartilhamento de experiências
- Comunidade interativa

### 🔐 Autenticação & Segurança
- Autenticação via Supabase
- Dados criptografados
- Controle total do usuário
- Sem venda de dados

---

## 🛠️ Tecnologias

### Frontend
- **Vue 3** - Framework JavaScript reativo com Composition API
- **Vite** - Build tool ultrarrápido
- **SCSS** - Pré-processador CSS com sistema responsivo via `clamp()`
- **Iconify Vue** - 10M+ ícones disponíveis
- **Vue Router** - Navegação SPA
- **Vue Sonner** - Toast notifications elegantes

### Backend & Banco de Dados
- **Supabase** - PostgreSQL + Autenticação + Real-time
- **RESTful API** - Integração com dados
- **Real-time Subscriptions** - Atualizações ao vivo

### Design System
- **Glassmorphism** - Estética moderna com transparência
- **Frutiger Aero Aesthetics** - Design visual único
- **Responsividade Fluida** - Adaptação automática com `clamp()`

---

## 📖 Como Usar

### 🏠 Home
- Acesse a página inicial com o feed da comunidade
- Navegue para Diagnóstico (IA) ou Busca de Produtos
- Veja análises e recomendações

### 🔍 Buscar Produtos
- Use a barra de busca no topo
- Filtre por categoria ou características
- Clique em um produto para ver detalhes
- Adicione às favoritas

### 🤖 Diagnóstico (AI Analysis)
- Responda perguntas sobre sua pele e rotina
- Receba recomendações personalizadas
- Salve suas preferências

### 👤 Seu Perfil
- Edite informações pessoais
- Upload de avatar
- Gerencie preferências
- Visualize histórico

### 💬 Comunidade
- Veja posts de outros usuários
- Comente e dê likes
- Compartilhe sua experiência
- Descubra novos produtos

---

## 📁 Estrutura do Projeto

```
skinsense/
├── src/
│   ├── assets/              # Imagens e recursos
│   │   └── products/        # Produtos por categoria
│   │       ├── makeup/
│   │       ├── skincare/
│   │       └── misc/
│   │
│   ├── components/          # Componentes reutilizáveis
│   │   ├── HeaderBar.vue    # Navbar superior
│   │   ├── FooterBar.vue    # Footer fixo
│   │   ├── DynamicWaves.vue # Animações
│   │   ├── PasswordInput.vue# Input customizado
│   │   └── MR/              # Módulo de Recomendação
│   │       ├── ProductCard.vue
│   │       └── RecommendationModule.vue
│   │
│   ├── routes/              # Páginas/Views
│   │   ├── HomeView.vue     # Home com feed
│   │   ├── LoginView.vue    # Autenticação
│   │   ├── SearchView.vue   # Busca de produtos
│   │   ├── AIAnalysisView.vue # Diagnóstico IA
│   │   ├── UserView.vue     # Perfil do usuário
│   │   ├── AboutView.vue    # Sobre o projeto
│   │   ├── ContactView.vue  # Contato
│   │   └── TermsView.vue    # Termos de uso
│   │
│   ├── composables/         # Lógica reutilizável
│   │   ├── useApi.js        # Chamadas API
│   │   ├── useAuth.js       # Autenticação
│   │   ├── useKeyboardShortcuts.js
│   │   └── index.js
│   │
│   ├── services/            # Serviços
│   │   ├── api.js           # Cliente API
│   │   ├── supabase.js      # Configuração Supabase
│   │   ├── products.js      # Gerenciar produtos
│   │   └── index.js
│   │
│   ├── App.vue              # Componente raiz
│   ├── main.js              # Entry point
│   └── main.scss            # Estilos globais + mixins
│
├── public/                  # Assets públicos
├── index.html               # HTML template
├── vite.config.js           # Configuração Vite
├── package.json             # Dependências
└── .env.example             # Exemplo de variáveis
```

---

## 💻 Desenvolvimento

### Convenções de Código

#### Estrutura Vue 3 Composition API
```vue
<template>
  <!-- Template -->
</template>

<script setup>
import { ref, computed } from "vue";
// Lógica reativa
</script>

<style scoped lang="scss">
/* Estilos com escopo local */
</style>
```

#### Nomeação
- Componentes: `PascalCase` (ex: `UserProfile.vue`)
- Variáveis: `camelCase` (ex: `userName`)
- Constantes: `UPPER_SNAKE_CASE` (ex: `API_URL`)

#### Responsividade
- Usa `clamp()` para tamanhos fluidos
- Media queries para breakpoints (768px, 480px)
- Mobile-first approach

### Design System

#### Componentes Globais
- Buttons (`.btn`, `.btn-ghost`, `.glass-button`)
- Modais (`.modal-overlay`, `.modal-card`)
- Cards (`.glass`, `.panel`)
- Inputs e Forms

#### Temas Disponíveis
- Light Mode (azul claro)
- Dark Mode (escuro)
- Accent colors: Azul, Verde, Vermelho, Roxo, B&W

#### SCSS Responsivo
O projeto usa `clamp()` para responsividade fluida:

```scss
// Tamanho de fonte que escala fluidamente
font-size: clamp(1.5rem, 4vw, 2.5rem);

// Padding responsivo
padding: clamp(16px, 4vw, 32px);
```

---

## 🔄 Fluxo de Desenvolvimento Recente

### Modernização de Responsividade
- Migração de media queries fixas para `clamp()` do SCSS
- Responsividade fluida em todos os componentes
- Melhor adaptação a diferentes tamanhos de tela

### Melhorias Mobile
- Botão de busca condicional na navbar para mobile
- Tamanhos de ícone otimizados (28px-32px no mobile)
- Interface adaptada para dispositivos pequenos

### Padronização de Design
- Alinhamento de modais com padrão LoginView
- Botões com estilo consistente via glassmorphism
- Sistema de cores globalizado com CSS variables

---

## 🌟 Características Especiais

- **Responsividade Fluida**: Usa `clamp()` em vez de breakpoints fixos
- **Design Acessível**: Contraste adequado, tamanhos legíveis, navegação intuitiva
- **Performance**: Vite para build otimizado, lazy loading de rotas
- **Real-time**: Supabase para atualizações ao vivo do feed
- **Tema Dinâmico**: 5 esquemas de cores intercambiáveis

---

## 📞 Contato

- 📧 **Email**: [shiver3dcontact@gmail.com](mailto:shiver3dcontact@gmail.com)
- 💻 **GitHub**: [github.com/shiver3d](https://github.com/shiver3d)

---

<div align="center">

Ajude a beleza alcançar mais pessoas. ✨

</div>
