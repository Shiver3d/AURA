/*
  Arquivo: src/routes/index.js
  Descrição: Define e exporta as rotas da aplicação (lazy-loaded via dynamic imports).

  Estrutura:
  - Cada view é carregada dinamicamente com `() => import('./MyView.vue')` para dividir o bundle.
  - O array `routes` mapeia path → componente.

  Como modificar:
  - Para adicionar uma rota, adicione um novo objeto em `routes` com `path`, `name` e `component`.
  - Para proteger rotas com autenticação, acrescente `beforeEnter` nas definições de rota ou use `router.beforeEach` global.
*/

import { createRouter, createWebHistory } from 'vue-router'

const Login = () => import('./LoginView.vue')
const Home = () => import('./HomeView.vue')
const Search = () => import('./SearchView.vue')
const User = () => import('./UserView.vue')
const AIAnalysis = () => import('./AIAnalysisView.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home },
  { path: '/search', name: 'Search', component: Search },
  { path: '/user', name: 'User', component: User },
  { path: '/ai-analysis', name: 'AIAnalysis', component: AIAnalysis }
]

const router = createRouter({ history: createWebHistory(), routes })

export default router
