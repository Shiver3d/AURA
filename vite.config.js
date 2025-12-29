/*
  Arquivo: vite.config.js
  Descrição: Configuração do Vite para o projeto.
  - Aqui registramos plugins (ex: plugin-vue) e outras otimizações de build/dev.

  Como modificar:
  - Adicione plugins ao array `plugins` para expandir comportamentos do Vite.
  - Para ajustar behavior de build, edite as opções passadas a `defineConfig`.
*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
